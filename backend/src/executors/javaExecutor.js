import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, mkdir, appendFile, readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { DEFAULT_CHALLENGE } from '../server.js';
import { getChallengeAssetContent, getHelperAssetType } from '../db/challengeContent.js';

const execAsync = promisify(exec);

// Helper to run spawn as a promise with timeout
function spawnAsync(command, args, options, timeoutMs) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, options);
    let stdout = '';
    let stderr = '';
    let timeoutId = null;
    
    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    
    if (timeoutMs) {
      timeoutId = setTimeout(() => {
        proc.kill('SIGTERM');
        // Force kill after a short grace period
        setTimeout(() => {
          if (!proc.killed) {
            proc.kill('SIGKILL');
          }
        }, 1000);
        
        const err = new Error('Execution timeout');
        err.code = 143; // SIGTERM exit code
        err.stdout = stdout;
        err.stderr = stderr;
        err.cmd = `${command} ${args.join(' ')}`;
        reject(err);
      }, timeoutMs);
    }
    
    proc.on('close', (code, signal) => {
      cleanup();
      if (code === 0) {
        resolve({ stdout, stderr, code, signal });
      } else {
        const err = new Error(`Command failed with code ${code}`);
        err.code = code;
        err.signal = signal;
        err.stdout = stdout;
        err.stderr = stderr;
        err.cmd = `${command} ${args.join(' ')}`;
        reject(err);
      }
    });
    
    proc.on('error', (err) => {
      cleanup();
      reject(err);
    });
  });
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get challenge-specific temp directory
function getTempDir(challengeId = DEFAULT_CHALLENGE) {
  return join(__dirname, '../../temp', challengeId, 'java');
}

const TIMEOUT_MS = 10000; // 10 seconds
const LOG_PATH = join(__dirname, '../../../.cursor/debug.log');

// Helper to write debug log
async function writeLog(data) {
  try {
    const logLine = JSON.stringify({...data, timestamp: Date.now()}) + '\n';
    await appendFile(LOG_PATH, logLine, 'utf8').catch(() => {});
    fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).catch(()=>{});
  } catch {}
}

// Find Java installation on macOS
async function findJavaInstallation() {
  // Check if JAVA_HOME is set
  if (process.env.JAVA_HOME) {
    return process.env.JAVA_HOME;
  }

  // Try to find Java in common macOS locations
  // Check Homebrew openjdk versions (e.g., openjdk@11, openjdk@17, etc.)
  const homebrewOpenJdkPaths = [
    '/opt/homebrew/opt/openjdk@11',
    '/opt/homebrew/opt/openjdk@17',
    '/opt/homebrew/opt/openjdk@21',
    '/opt/homebrew/opt/openjdk',
    '/usr/local/opt/openjdk@11',
    '/usr/local/opt/openjdk@17',
    '/usr/local/opt/openjdk@21',
    '/usr/local/opt/openjdk'
  ];

  for (const basePath of homebrewOpenJdkPaths) {
    try {
      const { access } = await import('fs/promises');
      // Check for Homebrew structure: basePath/libexec/openjdk.jdk/Contents/Home
      const javaHomePath = join(basePath, 'libexec/openjdk.jdk/Contents/Home');
      await access(join(javaHomePath, 'bin/javac'));
      return javaHomePath;
    } catch {}
  }

  // Check standard JavaVirtualMachines directories
  const commonJavaPaths = [
    '/Library/Java/JavaVirtualMachines',
    '/System/Library/Java/JavaVirtualMachines'
  ];

  for (const basePath of commonJavaPaths) {
    try {
      const { readdir } = await import('fs/promises');
      const entries = await readdir(basePath).catch(() => []);
      
      if (entries.length > 0) {
        // Find the latest JDK version
        const jdkDirs = entries.filter(e => e.includes('jdk') || e.match(/^\d+\./));
        if (jdkDirs.length > 0) {
          const jdkPath = join(basePath, jdkDirs.sort().reverse()[0], 'Contents/Home');
          // Verify javac exists
          try {
            const { access } = await import('fs/promises');
            await access(join(jdkPath, 'bin/javac'));
            return jdkPath;
          } catch {}
        }
      }
    } catch {}
  }

  // Try /usr/libexec/java_home (macOS utility)
  try {
    const { stdout } = await execAsync('/usr/libexec/java_home', { timeout: 2000 });
    const javaHome = stdout.trim();
    if (javaHome) {
      return javaHome;
    }
  } catch {}

  return null;
}

// Ensure temp directory exists
async function ensureTempDir(challengeId = DEFAULT_CHALLENGE) {
  try {
    const tempDir = getTempDir(challengeId);
    await mkdir(tempDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Detect if user code has a wrapper class pattern
// Returns: { hasWrapper: boolean, wrapperClassName: string, innerContent: string }
function detectWrapperClass(userCode) {
  if (!userCode || typeof userCode !== 'string') {
    return { hasWrapper: false, wrapperClassName: null, innerContent: userCode };
  }

  // Match: class ClassName { ... }
  // Look for class declarations at the start (allowing for whitespace/comments)
  const classPattern = /^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*\s*class\s+(\w+)\s*\{/m;
  const match = userCode.match(classPattern);
  
  if (!match) {
    return { hasWrapper: false, wrapperClassName: null, innerContent: userCode };
  }

  const className = match[1];
  const classStart = match.index + match[0].length;
  
  // Extract content inside the class by finding matching braces
  let braceCount = 1;
  let pos = classStart;
  let innerStart = pos;
  
  while (pos < userCode.length && braceCount > 0) {
    const char = userCode[pos];
    if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
    }
    pos++;
  }
  
  if (braceCount === 0) {
    // Found matching closing brace
    const innerContent = userCode.substring(innerStart, pos - 1).trim();
    // Check if there's anything substantial after the class (comments/whitespace are OK)
    const afterClass = userCode.substring(pos).trim();
    
    // Remove comments and whitespace to check if there's actual code after
    const afterClassNoComments = afterClass
      .replace(/\/\/.*$/gm, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .trim();
    
    // If inner content is substantial and there's no actual code after, it's likely a wrapper
    // Also, if the entire user code is just this one class (with optional comments), treat as wrapper
    if (innerContent.length > 0 && afterClassNoComments.length === 0) {
      return {
        hasWrapper: true,
        wrapperClassName: className,
        innerContent: innerContent
      };
    }
    
    // Special case: if the user code is essentially just this one class (even with comments after),
    // and the inner content looks like class members (methods, fields), treat it as a wrapper
    // This handles cases like LRUCache where there are comments after the class
    if (innerContent.length > 0) {
      // Check if inner content looks like class body (has methods, constructors, etc.)
      const hasClassMembers = /(public|private|protected)?\s*(static)?\s*\w+\s+\w+\s*\(/.test(innerContent);
      if (hasClassMembers && afterClassNoComments.length < 100) {
        // Likely just comments/documentation after the class
        return {
          hasWrapper: true,
          wrapperClassName: className,
          innerContent: innerContent
        };
      }
    }
  }
  
  return { hasWrapper: false, wrapperClassName: null, innerContent: userCode };
}

// Convert non-static classes to static when wrapping
// This ensures classes can be instantiated from static main() method
function makeClassesStatic(code) {
  if (!code || typeof code !== 'string') {
    return code;
  }

  // Process line by line to avoid false matches
  const lines = code.split('\n');
  const result = [];
  
  for (const line of lines) {
    // Match: whitespace* class ClassName (at start of line or after whitespace)
    // The regex captures: (indent)(class ClassName)
    const classMatch = line.match(/^(\s*)(class\s+\w+)/);
    if (classMatch) {
      const indent = classMatch[1]; // The whitespace before "class"
      const classDecl = classMatch[2]; // "class ClassName"
      const matchStart = classMatch.index; // Should be 0
      const matchEnd = matchStart + classMatch[0].length; // End of the match
      const afterClass = line.substring(matchEnd); // Everything after "class ClassName"
      
      // Check if "static" already appears before "class" in this line
      // We need to check the part before the match
      const beforeMatch = line.substring(0, matchStart);
      const beforeLower = beforeMatch.toLowerCase();
      if (!/\bstatic\b/.test(beforeLower)) {
        // Add static keyword: indent + "static " + "class ClassName" + rest
        result.push(indent + 'static ' + classDecl + afterClass);
        continue;
      }
    }
    result.push(line);
  }
  
  return result.join('\n');
}

// Remove inner class definitions from user code when top-level class exists
function removeInnerClassIfTopLevelExists(code, className, hasTopLevel) {
  if (!code || !hasTopLevel) {
    return code;
  }
  
  // More robust: match balanced braces for inner class
  // Find: "class ClassName {" and remove until matching "}"
  const lines = code.split('\n');
  const result = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    // Check if this line starts an inner class definition
    const classMatch = line.match(/^(\s+)(?:static\s+)?class\s+(\w+)\s*\{/);
    
    if (classMatch && classMatch[2] === className) {
      // Found inner class definition - skip it by finding matching brace
      let braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      i++;
      
      while (i < lines.length && braceCount > 0) {
        const currentLine = lines[i];
        braceCount += (currentLine.match(/\{/g) || []).length;
        braceCount -= (currentLine.match(/\}/g) || []).length;
        i++;
      }
      // Skip the line with the closing brace if we haven't already
      continue;
    }
    
    result.push(line);
    i++;
  }
  
  return result.join('\n');
}

// Extract class name from challenge template file
// Returns the class name or null if not found
async function extractClassNameFromTemplate(challengeId) {
  try {
    const templateContent = await getChallengeAssetContent({
      challengeId,
      type: 'template',
      language: 'java'
    });
    if (!templateContent) {
      return null;
    }
    
    // Match: class ClassName { (allowing for whitespace/comments before)
    const classPattern = /^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*\s*class\s+(\w+)\s*\{/m;
    const match = templateContent.match(classPattern);
    
    if (match && match[1]) {
      return match[1];
    }
    
    return null;
  } catch (error) {
    // If template file doesn't exist or can't be read, return null
    return null;
  }
}

export async function executeJavaCode(userCode, testCases, adapter, challengeId = DEFAULT_CHALLENGE) {
  if (!adapter) {
    throw new Error('Adapter is required for executeJavaCode');
  }
  
  await ensureTempDir(challengeId);
  
  const TEMP_DIR = getTempDir(challengeId);
  
  // Check if Node.java exists in data folder or DB and copy it to temp directory
  let hasTopLevelNode = false;
  let nodeJavaContent = null;
  try {
    nodeJavaContent = await getChallengeAssetContent({
      challengeId,
      type: getHelperAssetType('Node'),
      language: 'java'
    });
    if (!nodeJavaContent) {
      throw new Error('Node.java not found');
    }
    const nodeJavaDestPath = join(TEMP_DIR, 'Node.java');
    // #region agent log
    await writeLog({ location: 'javaExecutor.js:487', message: 'Before copying Node.java', data: { nodeJavaDestPath, contentLength: nodeJavaContent.length }, hypothesisId: 'A', sessionId: 'debug-session', runId: 'initial' });
    // #endregion
    await writeFile(nodeJavaDestPath, nodeJavaContent, 'utf8');
    // #region agent log
    await writeLog({ location: 'javaExecutor.js:490', message: 'After writing Node.java, verifying existence', data: { nodeJavaDestPath }, hypothesisId: 'A', sessionId: 'debug-session', runId: 'initial' });
    // #endregion
    await access(nodeJavaDestPath);
    hasTopLevelNode = true;
    // Log successful copy for debugging
    await writeLog({ event: 'node_java_copied', challengeId, path: nodeJavaDestPath });
  } catch (err) {
    // Node.java doesn't exist, that's fine - it means Node is an inner class
    hasTopLevelNode = false;
    // Log the error for debugging (but don't fail - Node might be inner class)
    // #region agent log
    await writeLog({ location: 'javaExecutor.js:495', message: 'Node.java copy failed', data: { error: err.message, stack: err.stack }, hypothesisId: 'A', sessionId: 'debug-session', runId: 'initial' });
    // #endregion
    await writeLog({ event: 'node_java_copy_failed', challengeId, error: err.message });
  }
  
  // Check if AttrResult.java exists in data folder or DB and copy it to temp directory
  let hasTopLevelAttrResult = false;
  try {
    const attrResultJavaContent = await getChallengeAssetContent({
      challengeId,
      type: getHelperAssetType('AttrResult'),
      language: 'java'
    });
    if (!attrResultJavaContent) {
      throw new Error('AttrResult.java not found');
    }
    await writeFile(join(TEMP_DIR, 'AttrResult.java'), attrResultJavaContent, 'utf8');
    hasTopLevelAttrResult = true;
  } catch (err) {
    // AttrResult.java doesn't exist, that's fine - it means AttrResult is an inner class
    hasTopLevelAttrResult = false;
  }
  
  // Check if ListNode.java exists in data folder or DB and copy it to temp directory
  let hasTopLevelListNode = false;
  try {
    const listNodeJavaContent = await getChallengeAssetContent({
      challengeId,
      type: getHelperAssetType('ListNode'),
      language: 'java'
    });
    if (!listNodeJavaContent) {
      throw new Error('ListNode.java not found');
    }
    await writeFile(join(TEMP_DIR, 'ListNode.java'), listNodeJavaContent, 'utf8');
    hasTopLevelListNode = true;
  } catch (err) {
    // ListNode.java doesn't exist, that's fine - it means ListNode is an inner class
    hasTopLevelListNode = false;
  }

  // Check if TreeNode.java exists in data folder or DB and copy it to temp directory
  let hasTopLevelTreeNode = false;
  try {
    const treeNodeJavaContent = await getChallengeAssetContent({
      challengeId,
      type: getHelperAssetType('TreeNode'),
      language: 'java'
    });
    if (!treeNodeJavaContent) {
      throw new Error('TreeNode.java not found');
    }
    await writeFile(join(TEMP_DIR, 'TreeNode.java'), treeNodeJavaContent, 'utf8');
    hasTopLevelTreeNode = true;
  } catch (err) {
    // TreeNode.java doesn't exist, that's fine - it means TreeNode is an inner class
    hasTopLevelTreeNode = false;
  }
  
  // Get default class name from template or adapter
  let className = null;
  const templateClassName = await extractClassNameFromTemplate(challengeId);
  if (templateClassName) {
    className = templateClassName;
  } else if (adapter.getDefaultClassName) {
    className = adapter.getDefaultClassName();
  }
  
  // If still no className, we'll determine it from wrapper detection or extraction
  // Initialize file paths with a temporary name (will be updated later)
  let fileName = className ? `${className}.java` : 'Solution.java';
  let filePath = join(TEMP_DIR, fileName);
  const classPath = TEMP_DIR;

  // Convert Java type name to valid Java identifier for use in method names
  // e.g., "int[]" -> "IntArray", "String" -> "String"
  function sanitizeTypeNameForMethodName(typeName) {
    if (!typeName) return 'Unknown';
    
    // Handle array types: "int[]" -> "IntArray", "String[]" -> "StringArray"
    if (typeName.endsWith('[]')) {
      const baseType = typeName.slice(0, -2);
      const sanitizedBase = sanitizeTypeNameForMethodName(baseType);
      return sanitizedBase + 'Array';
    }
    
    // Handle primitive types: capitalize first letter
    const primitiveMap = {
      'int': 'Int',
      'long': 'Long',
      'double': 'Double',
      'float': 'Float',
      'boolean': 'Boolean',
      'byte': 'Byte',
      'short': 'Short',
      'char': 'Char'
    };
    
    if (primitiveMap[typeName]) {
      return primitiveMap[typeName];
    }
    
    // For class names (String, Node, AttrResult, etc.), use as-is
    return typeName;
  }

  // Generate code to build expected result for each test case
  // Note: Return-type classes are always top-level, so no qualification needed
  function generateExpectedMethod(index, expected, className, isTopLevelNode, isTopLevelAttrResult) {
    let expectedCode = adapter.buildExpectedCode(expected, '        ', 'expected');
    const returnType = adapter.getReturnType();
    // Return-type classes are always provided as top-level utility files
    let qualifiedReturnType = returnType;
    const methodNameSuffix = sanitizeTypeNameForMethodName(returnType);
    return `    private static ${qualifiedReturnType} getExpected${methodNameSuffix}${index}() {
${expectedCode}        return expected;
    }`;
  }

  // Check if user code already defines required classes/types
  // Note: Return-type classes (Node, AttrResult) are always provided as top-level utility files,
  // but we still check to remove any inner class definitions the user might have included
  const hasUserDefined = adapter.checkUserDefinedClasses(userCode);

  // Remove inner AttrResult class from user code if top-level AttrResult.java exists
  // (Always true for return types, but keep this for safety)
  if (hasTopLevelAttrResult && adapter.getReturnType() === 'AttrResult') {
    userCode = removeInnerClassIfTopLevelExists(
      userCode,
      'AttrResult',
      hasTopLevelAttrResult
    );
  }
  
  // Remove inner ListNode class from user code if top-level ListNode.java exists
  if (hasTopLevelListNode && adapter.getReturnType() === 'ListNode') {
    userCode = removeInnerClassIfTopLevelExists(
      userCode,
      'ListNode',
      hasTopLevelListNode
    );
  }

  // Remove inner TreeNode class from user code if top-level TreeNode.java exists
  if (hasTopLevelTreeNode && adapter.getReturnType() === 'TreeNode') {
    userCode = removeInnerClassIfTopLevelExists(
      userCode,
      'TreeNode',
      hasTopLevelTreeNode
    );
  }

  // Use adapter's extractUserCode if available, otherwise use default wrapper detection
  let finalClassName = className; // Will be set from template/adapter or wrapper detection
  let processedUserCode = userCode;
  let instanceVarName = 'parser';
  let needsParserInstance = true; // Whether to create parser instance in main()
  
  if (adapter.extractUserCode) {
    // #region agent log
    await writeLog({ location: 'javaExecutor.js:578', message: 'Using adapter.extractUserCode', data: { userCodeLength: userCode.length, userCodePreview: userCode.substring(0, 300) }, hypothesisId: 'A', sessionId: 'debug-session', runId: 'initial' });
    // #endregion
    const extractionResult = await adapter.extractUserCode(userCode, challengeId);
    if (extractionResult) {
      processedUserCode = extractionResult.processedCode;
      if (extractionResult.className) {
        finalClassName = extractionResult.className;
      }
      instanceVarName = extractionResult.instanceVarName || 'parser';
      needsParserInstance = extractionResult.needsInstance !== undefined 
        ? extractionResult.needsInstance 
        : true;
      // #region agent log
      await writeLog({ location: 'javaExecutor.js:599', message: 'After adapter.extractUserCode', data: { processedUserCodeLength: processedUserCode.length, processedUserCodePreview: processedUserCode.substring(0, 300), finalClassName, needsParserInstance }, hypothesisId: 'D', sessionId: 'debug-session', runId: 'initial' });
      // #endregion
    }
  } else {
    // Fallback to default wrapper detection logic
    const patternDetection = detectWrapperClass(userCode);
    
    // If wrapper class detected, use that class name and extract inner content
    if (patternDetection.hasWrapper) {
      finalClassName = patternDetection.wrapperClassName;
      processedUserCode = patternDetection.innerContent;
      instanceVarName = 'parser'; // Keep same variable name for adapter compatibility
      
      // Check if adapter's generateInvocation actually uses the instance variable
      // If not, we don't need to create a parser instance
      const invocationCode = adapter.generateInvocation(instanceVarName);
      needsParserInstance = invocationCode.includes(instanceVarName + '.') || invocationCode.includes(instanceVarName + '(');
    } else {
      // Standalone class pattern: make classes static so they can be instantiated from static main()
      processedUserCode = makeClassesStatic(userCode);
      instanceVarName = 'parser'; // Still use parser for consistency, but adapters handle direct instantiation
      
      // Check if adapter's generateInvocation actually uses the instance variable
      // If it does, we need to create a parser instance
      const invocationCode = adapter.generateInvocation(instanceVarName);
      needsParserInstance = invocationCode.includes(instanceVarName + '.') || invocationCode.includes(instanceVarName + '(');
      
      // Use className from template/adapter if we have it, otherwise keep finalClassName as is
      if (className) {
        finalClassName = className;
      }
    }
  }

  // Update file paths based on final class name
  // finalClassName should be set by now (from adapter.extractUserCode, wrapper detection, or template/adapter default)
  if (!finalClassName) {
    throw new Error(`Could not determine class name for challenge ${challengeId}. Please ensure template.java exists or adapter provides getDefaultClassName().`);
  }
  className = finalClassName;
  fileName = `${className}.java`;
  filePath = join(TEMP_DIR, fileName);

  // Apply adapter's transformUserCode if available (e.g., for time control)
  if (adapter.transformUserCode) {
    processedUserCode = adapter.transformUserCode(processedUserCode, testCases);
  }

  // Wrap user code in a complete Java class
  const returnType = adapter.getReturnType();
  const serializerMethod = adapter.getSerializerMethod();
  const resultsFileName = `${className}_results_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.json`;
  const resultsPath = join(TEMP_DIR, resultsFileName);
  // Return-type classes (Node, AttrResult) are always provided as top-level utility files,
  // so no qualification needed
  let qualifiedReturnType = returnType;
  
  // Check if return type is a primitive type
  const primitiveTypes = ['boolean', 'int', 'long', 'double', 'float', 'char', 'byte', 'short'];
  const isPrimitiveType = primitiveTypes.includes(returnType);
  
  // Get default value for primitive types
  const getDefaultValue = (type) => {
    switch(type) {
      case 'boolean': return 'false';
      case 'int': return '0';
      case 'long': return '0L';
      case 'double': return '0.0';
      case 'float': return '0.0f';
      case 'char': return "'\\0'";
      case 'byte': return '0';
      case 'short': return '0';
      default: return 'null';
    }
  };
  const defaultValue = getDefaultValue(returnType);
  
  // Sanitize return type for use in method names (e.g., "int[]" -> "IntArray")
  const returnTypeForMethodName = sanitizeTypeNameForMethodName(returnType);
  
  // Generate serializer (no qualification needed since return types are always top-level)
  let serializerCode = adapter.generateSerializer();
  
  // Generate TestClock as a top-level class available to all challenges
  // Check if TestClock.java already exists to avoid duplicates when compiling multiple files
  let testClockClass = '';
  try {
    const testClockPath = join(TEMP_DIR, 'TestClock.java');
    await access(testClockPath);
    // TestClock.java already exists, don't include it in this file
    testClockClass = '';
    // #region agent log
    await writeLog({ location: 'javaExecutor.js:760', message: 'TestClock.java already exists, skipping', data: { testClockPath }, hypothesisId: 'B', sessionId: 'debug-session', runId: 'initial' });
    // #endregion
  } catch {
    // TestClock.java doesn't exist, write it to a separate file to avoid duplicates
    const testClockContent = `// Mock clock for time-controlled tests (available to all challenges)
class TestClock {
    private static Long mockTime = null;
    
    public static long currentTimeMillis() {
        if (mockTime != null) {
            return mockTime;
        }
        return System.currentTimeMillis();
    }
    
    public static void setCurrentTime(long time) {
        mockTime = time;
    }
    
    public static void reset() {
        mockTime = null;
    }
}
`;
    const testClockPath = join(TEMP_DIR, 'TestClock.java');
    await writeFile(testClockPath, testClockContent, 'utf8');
    testClockClass = '';
    // #region agent log
    await writeLog({ location: 'javaExecutor.js:785', message: 'Created TestClock.java separately', data: { testClockPath }, hypothesisId: 'B', sessionId: 'debug-session', runId: 'initial' });
    // #endregion
  }

  // #region agent log
  const userCodeAttrResultMatch = processedUserCode?.match(/\b(boolean\s+selfclosing|Map<String,\s*String>\s+attrs|int\s+endIndex|public\s+AttrResult\s*\()/);
  const userCodeHasMalformedAttrResult = userCodeAttrResultMatch !== null;
  await writeLog({ location: 'javaExecutor.js:666', message: 'Checking for malformed AttrResult in user code', data: { userCodeHasMalformedAttrResult, userCodePreview: processedUserCode?.substring(0, 1000), matchFound: userCodeAttrResultMatch?.[0] }, hypothesisId: 'A', sessionId: 'debug-session', runId: 'initial' });
  // #endregion
  
  // Validate for malformed constructors and method signatures (e.g., trailing commas in parameter lists)
  const malformedSignaturePattern = /(?:public|private|protected)?\s*(?:\w+\s+)?\w+\s*\([^)]*,\s*\)/;
  const malformedSignatureMatch = processedUserCode?.match(malformedSignaturePattern);
  if (malformedSignatureMatch) {
    const errorMsg = `Malformed constructor or method signature detected: "${malformedSignatureMatch[0]}"\n` +
      `This usually indicates a trailing comma in a parameter list without a following parameter.\n` +
      `Please check your code for incomplete method/constructor signatures.`;
    await writeLog({ 
      location: 'javaExecutor.js:validateSignatures', 
      message: 'Malformed signature detected', 
      data: { 
        match: malformedSignatureMatch[0],
        userCodePreview: processedUserCode.substring(0, 1000)
      }, 
      hypothesisId: 'A', 
      sessionId: 'debug-session', 
      runId: 'initial' 
    });
    // Note: We don't throw here to allow compilation to proceed and show the actual Java compiler error
    // But we log it for debugging purposes
  }
  
  // Safety check: ensure processedUserCode doesn't contain class declarations
  // The executor wraps it in a class, so any class declarations would create nested classes
  // Match class declarations that may be indented (not just at start of string)
  const classDeclarationPattern = /(?:^|\n)\s*(?:public\s+|private\s+|protected\s+|static\s+)*class\s+(\w+)\s*\{/m;
  const classMatch = processedUserCode?.match(classDeclarationPattern);
  if (classMatch) {
    // Check if the matched class name matches the final class name (would create duplicate)
    const matchedClassName = classMatch[1];
    
    // Only extract if it's a duplicate (same name as final class)
    if (matchedClassName === finalClassName) {
      // Extract just the class body if a class declaration is found
      // Strategy: Find the class declaration line, skip to the opening brace, then extract everything
      // until we find the matching closing brace (or use a fallback if brace matching fails)
      const classStart = classMatch.index;
      
      // Find the opening brace of the class
      let pos = classStart;
      while (pos < processedUserCode.length && processedUserCode[pos] !== '{') {
        pos++;
      }
      
      if (pos < processedUserCode.length) {
        // Start from after the opening brace
        let braceCount = 1;
        pos++;
        const bodyStart = pos;
        
        // Match braces, handling string literals and comments that might contain braces
        let inString = false;
        let inCharLiteral = false;
        let escapeNext = false;
        let inLineComment = false;
        let inBlockComment = false;
        
        while (pos < processedUserCode.length && braceCount > 0) {
          const char = processedUserCode[pos];
          
          if (escapeNext) {
            escapeNext = false;
            pos++;
            continue;
          }
          
          if (inLineComment) {
            if (char === '\n') {
              inLineComment = false;
            }
            pos++;
            continue;
          }
          
          if (inBlockComment) {
            if (char === '*' && pos + 1 < processedUserCode.length && processedUserCode[pos + 1] === '/') {
              inBlockComment = false;
              pos += 2;
              continue;
            }
            pos++;
            continue;
          }
          
          if (char === '\\' && (inString || inCharLiteral)) {
            escapeNext = true;
            pos++;
            continue;
          }
          
          if (char === '"' && !inCharLiteral) {
            inString = !inString;
            pos++;
            continue;
          }
          
          if (char === '\'' && !inString) {
            inCharLiteral = !inCharLiteral;
            pos++;
            continue;
          }
          
          if (!inString && !inCharLiteral) {
            if (char === '/' && pos + 1 < processedUserCode.length) {
              const nextChar = processedUserCode[pos + 1];
              if (nextChar === '/') {
                inLineComment = true;
                pos += 2;
                continue;
              } else if (nextChar === '*') {
                inBlockComment = true;
                pos += 2;
                continue;
              }
            }
            
            if (char === '{') braceCount++;
            else if (char === '}') braceCount--;
          }
          
          pos++;
        }
        
        if (braceCount === 0) {
          // Successfully matched braces - extract the body
          const extractedBody = processedUserCode.substring(bodyStart, pos - 1).trim();
          processedUserCode = extractedBody;
        } else {
          // Brace matching failed - try fallback: remove class declaration line and first opening brace
          // Find the end of the class declaration line
          const lineEnd = processedUserCode.indexOf('\n', classStart);
          if (lineEnd > 0) {
            // Remove from start to after the opening brace on the declaration line
            const afterBrace = processedUserCode.indexOf('{', classStart) + 1;
            if (afterBrace > 0 && afterBrace < processedUserCode.length) {
              // Try to find the last closing brace as a fallback
              let lastClosingBrace = processedUserCode.lastIndexOf('}');
              if (lastClosingBrace > afterBrace) {
                const extractedBody = processedUserCode.substring(afterBrace, lastClosingBrace).trim();
                processedUserCode = extractedBody;
              }
            }
          }
        }
      }
    }
  }
  
  // Process Node class content for inclusion in generated file if needed
  let nodeClassContent = '';
  // Only include Node content if it's NOT a top-level file (i.e., it needs to be included)
  // If hasTopLevelNode is true, Node.java exists separately and will be compiled on its own
  if (!hasTopLevelNode && adapter.getReturnType() === 'Node' && nodeJavaContent) {
    // Remove import statements since we already have them in the generated file
    const processedNodeContent = nodeJavaContent.replace(/^import\s+.*?;\s*\n?/gm, '').trim();
    nodeClassContent = processedNodeContent + '\n\n';
  }
  
  // Process ListNode class content for inclusion in generated file if needed
  // (ListNode is always top-level for reverse_linked_list challenge, so this won't be used)
  // But we keep the pattern consistent
  let listNodeClassContent = '';
  if (!hasTopLevelListNode && adapter.getReturnType() === 'ListNode') {
    // ListNode should always be top-level, but handle edge case
    listNodeClassContent = '';
  }
  
  const fullCode = `import java.util.*;
import java.io.*;

${nodeClassContent}${listNodeClassContent}${testClockClass}public class ${className} {
${adapter.generateHelperClasses(hasUserDefined, hasTopLevelNode, hasTopLevelAttrResult)}    ${processedUserCode}
}
class ${className}TestHarness {
    private static ${className} parser;
    private static final String RESULTS_PATH = ${JSON.stringify(resultsPath)};

    static class TestResult {
        final String actual;
        final String expected;
        final boolean passed;
        final long durationMs;
        final String stdout;
        final String error;

        TestResult(String actual, String expected, boolean passed, long durationMs, String stdout, String error) {
            this.actual = actual;
            this.expected = expected;
            this.passed = passed;
            this.durationMs = durationMs;
            this.stdout = stdout;
            this.error = error;
        }
    }

    private static String escapeJson(String value) {
        if (value == null) {
            return null;
        }
        StringBuilder escaped = new StringBuilder();
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            switch (c) {
                case '\\\\':
                    escaped.append("\\\\\\\\");
                    break;
                case '"':
                    escaped.append("\\\\\\\"");
                    break;
                case '\\n':
                    escaped.append("\\\\n");
                    break;
                case '\\r':
                    escaped.append("\\\\r");
                    break;
                case '\\t':
                    escaped.append("\\\\t");
                    break;
                default:
                    if (c < 0x20) {
                        escaped.append(String.format("\\\\u%04x", (int) c));
                    } else {
                        escaped.append(c);
                    }
                    break;
            }
        }
        return escaped.toString();
    }

    private static String toJsonValue(String value) {
        if (value == null) {
            return "null";
        }
        return "\\"" + escapeJson(value) + "\\"";
    }

    private static void writeResultsFile(List<TestResult> results) {
        StringBuilder json = new StringBuilder();
        json.append("{\\"results\\":[");
        for (int i = 0; i < results.size(); i++) {
            TestResult result = results.get(i);
            if (i > 0) {
                json.append(",");
            }
            json.append("{");
            json.append("\\"actual\\":").append(toJsonValue(result.actual)).append(",");
            json.append("\\"expected\\":").append(toJsonValue(result.expected)).append(",");
            json.append("\\"passed\\":").append(result.passed).append(",");
            json.append("\\"durationMs\\":").append(result.durationMs).append(",");
            json.append("\\"stdout\\":").append(toJsonValue(result.stdout)).append(",");
            json.append("\\"error\\":").append(toJsonValue(result.error));
            json.append("}");
        }
        json.append("]}");
        try (FileWriter writer = new FileWriter(RESULTS_PATH)) {
            writer.write(json.toString());
        } catch (Exception e) {
            System.err.println("ERROR writing results file: " + e.getMessage());
        }
    }
    
${serializerCode}
    
${testCases.map((tc, idx) => generateExpectedMethod(idx, tc.expected, className, hasTopLevelNode, hasTopLevelAttrResult)).join('\n\n')}
    
    // Helper class to capture stdout
    static class CapturingPrintStream extends PrintStream {
        private StringBuilder buffer = new StringBuilder();
        private PrintStream original;
        
        public CapturingPrintStream(PrintStream original) {
            super(new java.io.ByteArrayOutputStream(), true);
            this.original = original;
        }
        
        @Override
        public void print(String s) {
            if (s != null) {
                buffer.append(s);
            }
            // Don't call super.print(s) - suppress output to original stream
        }
        
        @Override
        public void print(char c) {
            buffer.append(c);
            // Don't call super.print(c) - suppress output to original stream
        }
        
        @Override
        public void print(int i) {
            buffer.append(String.valueOf(i));
            // Don't call super.print(i) - suppress output to original stream
        }
        
        @Override
        public void print(long l) {
            buffer.append(String.valueOf(l));
            // Don't call super.print(l) - suppress output to original stream
        }
        
        @Override
        public void print(double d) {
            buffer.append(String.valueOf(d));
            // Don't call super.print(d) - suppress output to original stream
        }
        
        @Override
        public void print(boolean b) {
            buffer.append(String.valueOf(b));
            // Don't call super.print(b) - suppress output to original stream
        }
        
        @Override
        public void print(Object obj) {
            String str = obj != null ? obj.toString() : "null";
            buffer.append(str);
            // Don't call super.print(obj) - suppress output to original stream
        }
        
        @Override
        public void println() {
            buffer.append(System.lineSeparator());
            // Don't call super.println() - suppress output to original stream
        }
        
        @Override
        public void println(String s) {
            if (s != null) {
                buffer.append(s);
            }
            buffer.append(System.lineSeparator());
            // Don't call super.println(s) - suppress output to original stream
        }
        
        @Override
        public void println(char c) {
            buffer.append(c);
            buffer.append(System.lineSeparator());
            // Don't call super.println(c) - suppress output to original stream
        }
        
        @Override
        public void println(int i) {
            buffer.append(String.valueOf(i));
            buffer.append(System.lineSeparator());
            // Don't call super.println(i) - suppress output to original stream
        }
        
        @Override
        public void println(long l) {
            buffer.append(String.valueOf(l));
            buffer.append(System.lineSeparator());
            // Don't call super.println(l) - suppress output to original stream
        }
        
        @Override
        public void println(double d) {
            buffer.append(String.valueOf(d));
            buffer.append(System.lineSeparator());
            // Don't call super.println(d) - suppress output to original stream
        }
        
        @Override
        public void println(boolean b) {
            buffer.append(String.valueOf(b));
            buffer.append(System.lineSeparator());
            // Don't call super.println(b) - suppress output to original stream
        }
        
        @Override
        public void println(Object obj) {
            String str = obj != null ? obj.toString() : "null";
            buffer.append(str);
            buffer.append(System.lineSeparator());
            // Don't call super.println(obj) - suppress output to original stream
        }
        
        @Override
        public void flush() {
            super.flush();
        }
        
        public String getCapturedOutput() {
            return buffer.toString();
        }
        
        public void reset() {
            buffer.setLength(0);
        }
    }
    
    // Test runner
    public static void main(String[] args) {
        ${needsParserInstance ? `parser = new ${className}();` : ''}
        List<TestResult> results = new ArrayList<>();
        StringBuilder markerResults = new StringBuilder();
        PrintStream originalOut = System.out;
        
        for (int i = 0; i < ${testCases.length}; i++) {
            CapturingPrintStream capturingOut = new CapturingPrintStream(originalOut);
            System.setOut(capturingOut);
            String errorMessage = null;
            
            try {
                long startTime = System.currentTimeMillis();
                ${isPrimitiveType ? `${qualifiedReturnType} actual = ${defaultValue};` : `${qualifiedReturnType} actual = null;`}
                ${isPrimitiveType ? `boolean actualError = false;` : ''}
                try {
                    ${adapter.generateInvocation('parser')}
                } catch (Exception parseEx) {
                    // Log exception details to stderr so they're visible
                    StringWriter sw = new StringWriter();
                    parseEx.printStackTrace(new PrintWriter(sw));
                    String stackTrace = sw.toString().trim();
                    errorMessage = "ERROR in test " + i + " (method invocation): " + parseEx.getClass().getName() + ": " + parseEx.getMessage();
                    if (!stackTrace.isEmpty()) {
                        errorMessage = errorMessage + System.lineSeparator() + stackTrace;
                    }
                    System.err.println("ERROR in test " + i + " (method invocation): " + parseEx.getClass().getName() + ": " + parseEx.getMessage());
                    parseEx.printStackTrace(System.err);
                    // If parsing fails, mark error for primitives or set to null for objects
                    ${isPrimitiveType ? `actualError = true;` : `actual = null;`}
                }
                
                ${isPrimitiveType ? `${qualifiedReturnType} expected = ${defaultValue};` : `${qualifiedReturnType} expected = null;`}
                ${isPrimitiveType ? `boolean expectedError = false;` : ''}
                try {
                    switch(i) {
${testCases.map((tc, idx) => `                        case ${idx}: expected = getExpected${returnTypeForMethodName}${idx}(); break;`).join('\n')}
                    }
                } catch (Exception expectedEx) {
                    // If building expected fails, mark error for primitives or set to null for objects
                    ${isPrimitiveType ? `expectedError = true;` : `expected = null;`}
                }
                
                String actualStr = ${isPrimitiveType ? `actualError ? "null" : ${serializerMethod}(actual)` : `${serializerMethod}(actual)`};
                String expectedStr = ${isPrimitiveType ? `expectedError ? "null" : ${serializerMethod}(expected)` : `${serializerMethod}(expected)`};
                // #region agent log
                try {
                    java.io.FileWriter fw = new java.io.FileWriter("/Users/markogalesic/dev/problem-set/.cursor/debug.log", true);
                    java.io.BufferedWriter bw = new java.io.BufferedWriter(fw);
                    String logData = "test=" + i + ",actual=" + (actualStr != null ? actualStr.replace("\\"", "\\\\\\"") : "null") + ",expected=" + (expectedStr != null ? expectedStr.replace("\\"", "\\\\\\"") : "null");
                    String json = "{\\"location\\":\\"TestHarness:main\\",\\"message\\":\\"Test result\\",\\"data\\":\\"" + logData + "\\",\\"hypothesisId\\":\\"F\\",\\"sessionId\\":\\"debug-session\\",\\"runId\\":\\"post-fix\\",\\"timestamp\\":" + System.currentTimeMillis() + "}";
                    bw.write(json);
                    bw.newLine();
                    bw.close();
                } catch (Exception e) {
                    // Ignore
                }
                // #endregion
                boolean passed = actualStr != null && expectedStr != null && actualStr.equals(expectedStr);
                long endTime = System.currentTimeMillis();
                long duration = endTime - startTime;
                
                // Capture stdout before restoring (but don't include it in results)
                String stdout = capturingOut.getCapturedOutput();
                System.setOut(originalOut);
                
                String actualValue = actualStr != null ? actualStr : "null";
                String expectedValue = expectedStr != null ? expectedStr : "null";
                String stdoutValue = stdout != null ? stdout : "";
                results.add(new TestResult(actualValue, expectedValue, passed, duration, stdoutValue, errorMessage));
                
                markerResults.append("TEST_").append(i).append("_ACTUAL:").append(actualValue).append(System.lineSeparator());
                markerResults.append("TEST_").append(i).append("_EXPECTED:").append(expectedValue).append(System.lineSeparator());
                markerResults.append("TEST_").append(i).append("_RESULT:").append(passed ? "PASS" : "FAIL").append(System.lineSeparator());
                markerResults.append("TEST_").append(i).append("_TIME:").append(duration).append(System.lineSeparator());
                markerResults.append("TEST_").append(i).append("_STDOUT:").append(stdoutValue).append(System.lineSeparator());
            } catch (Exception e) {
                // Capture stdout even on error (but don't include it in results)
                String stdout = capturingOut.getCapturedOutput();
                System.setOut(originalOut);
                
                // Even if there's an error, output something for this test
                String stdoutValue = stdout != null ? stdout : "";
                errorMessage = "ERROR in test " + i + ": " + e.getMessage();
                results.add(new TestResult("null", "null", false, 0, stdoutValue, errorMessage));
                
                markerResults.append("TEST_").append(i).append("_ACTUAL:null").append(System.lineSeparator());
                markerResults.append("TEST_").append(i).append("_EXPECTED:null").append(System.lineSeparator());
                markerResults.append("TEST_").append(i).append("_RESULT:FAIL").append(System.lineSeparator());
                markerResults.append("TEST_").append(i).append("_TIME:0").append(System.lineSeparator());
                markerResults.append("TEST_").append(i).append("_STDOUT:").append(stdoutValue).append(System.lineSeparator());
                System.err.println(errorMessage);
            }
        }
        
        // Always output results, even if there were errors
        writeResultsFile(results);
        System.err.print(markerResults.toString());
        System.err.flush();
    }
    
${adapter.generateInputHelpers(testCases)}
}`;

  // #region agent log
  await writeLog({ location: 'javaExecutor.js:1054', message: 'After generating fullCode', data: { className, processedUserCodeLength: processedUserCode?.length ?? 0, processedUserCodePreview: processedUserCode?.substring(0, 1000) ?? '', fullCodeLength: fullCode.length, fullCodePreview: fullCode.substring(0, 1500), hasUserDefined, hasTopLevelNode, hasTopLevelAttrResult, challengeId }, hypothesisId: 'E', sessionId: 'debug-session', runId: 'initial' });
  // #endregion

  try {
    // Write Java file
    await writeFile(filePath, fullCode, 'utf8');
    // #region agent log
    await writeLog({ location: 'javaExecutor.js:1060', message: 'After writing Java file', data: { filePath, fullCodeLength: fullCode.length, fullCodePreview: fullCode.substring(0, 1000), className, challengeId }, hypothesisId: 'B', sessionId: 'debug-session', runId: 'initial' });
    // #endregion

    // Compile Java code
    // Compile all .java files in temp directory to support top-level classes like Node.java
    const { readdir: readdirForCompile } = await import('fs/promises');
    const javaFiles = (await readdirForCompile(TEMP_DIR).catch(() => [])).filter(f => f.endsWith('.java'));
    // #region agent log
    await writeLog({ location: 'javaExecutor.js:1062', message: 'Before compilation - listing Java files', data: { tempDir: TEMP_DIR, javaFiles, hasTopLevelNode, fileCount: javaFiles.length, challengeId }, hypothesisId: 'A', sessionId: 'debug-session', runId: 'initial' });
    // #endregion
    
    // Check for TestClock in each file
    for (const javaFile of javaFiles) {
      const fileContent = await readFile(join(TEMP_DIR, javaFile), 'utf8').catch(() => '');
      const testClockCount = (fileContent.match(/class TestClock/g) || []).length;
      const classDeclarations = (fileContent.match(/^\s*class\s+\w+/gm) || []).map(m => m.trim());
      // #region agent log
      await writeLog({ location: 'javaExecutor.js:1082', message: 'Checking Java file content', data: { javaFile, testClockCount, fileLength: fileContent.length, classDeclarations, contentPreview: fileContent.substring(0, 500) }, hypothesisId: 'D', sessionId: 'debug-session', runId: 'initial' });
      // #endregion
    }
    const javaFilesArgs = javaFiles.map(f => `"${join(TEMP_DIR, f)}"`).join(' ');
    
    const compileCmd = `javac -cp "${classPath}" ${javaFilesArgs}`;
    // #region agent log
    await writeLog({ location: 'javaExecutor.js:1087', message: 'Compilation command constructed', data: { compileCmd, classPath, javaFilesArgs, javaFilesCount: javaFiles.length }, hypothesisId: 'C', sessionId: 'debug-session', runId: 'initial' });
    // #endregion
    
    // Try to find Java installation if not in PATH
    let javaHome = await findJavaInstallation();
    let execEnv = { ...process.env };
    let javacCmd = compileCmd;
    
    if (javaHome) {
      const javacPath = join(javaHome, 'bin/javac');
      javacCmd = `"${javacPath}" -cp "${classPath}" ${javaFilesArgs}`;
      execEnv.JAVA_HOME = javaHome;
      execEnv.PATH = `${join(javaHome, 'bin')}:${process.env.PATH || ''}`;
    }
    // #region agent log
    await writeLog({ location: 'javaExecutor.js:1099', message: 'Before executing javac', data: { javacCmd, javaHome, classPath, cwd: TEMP_DIR }, hypothesisId: 'C', sessionId: 'debug-session', runId: 'initial' });
    // #endregion
    
    try {
      const { stderr: compileError, stdout: compileStdout } = await execAsync(
        javacCmd,
        { timeout: 5000, cwd: TEMP_DIR, env: execEnv }
      );
      // #region agent log
      await writeLog({ location: 'javaExecutor.js:1105', message: 'After javac execution', data: { compileError: compileError || '(empty)', compileStdout: compileStdout || '(empty)', compileErrorLength: compileError?.length || 0, compileStdoutLength: compileStdout?.length || 0 }, hypothesisId: 'C', sessionId: 'debug-session', runId: 'initial' });
      // #endregion
      
      if (compileError && compileError.trim()) {
        // #region agent log
        await writeLog({ location: 'javaExecutor.js:1109', message: 'Compilation error detected', data: { compileError: compileError, compileErrorFull: compileError }, hypothesisId: 'B', sessionId: 'debug-session', runId: 'initial' });
        // #endregion
        return {
          success: false,
          error: `Compilation error: ${compileError}`,
          results: []
        };
      }
    } catch (compileErr) {
      // #region agent log
      await writeLog({ location: 'javaExecutor.js:1118', message: 'Compilation exception caught', data: { error: compileErr.message, stderr: compileErr.stderr || '(none)', stdout: compileErr.stdout || '(none)', code: compileErr.code, signal: compileErr.signal, cmd: compileErr.cmd }, hypothesisId: 'C', sessionId: 'debug-session', runId: 'initial' });
      // #endregion
      // Provide helpful error message for Java not found
      const errorMsg = compileErr.stderr || compileErr.message || '';
      if (errorMsg.includes('Unable to locate a Java Runtime') || errorMsg.includes('Java Runtime')) {
        return {
          success: false,
          error: `Java JDK is not installed. Please install Java JDK 11+ to run Java code.\n\nOn macOS, you can install it via:\n  brew install openjdk@11\n\nOr download from: https://adoptium.net/`,
          results: []
        };
      }
      
      return {
        success: false,
        error: `Compilation failed: ${compileErr.message}`,
        results: []
      };
    }

    // Execute Java code
    const startTime = Date.now();
    let executionResult;
    
    // Use the same Java installation for execution
    let javaExecutable = 'java';
    let javaArgs = ['-cp', classPath, `${className}TestHarness`];
    let javaPath = null;
    if (javaHome) {
      javaPath = join(javaHome, 'bin/java');
      javaExecutable = javaPath;
    }
    
    try {
      // Use spawn instead of exec to avoid shell quoting issues
      executionResult = await spawnAsync(javaExecutable, javaArgs, { cwd: TEMP_DIR, env: execEnv }, TIMEOUT_MS);
    } catch (execErr) {
      const errorMsg = execErr.stderr || execErr.message || 'Execution failed';
      return {
        success: false,
        error: `Runtime error: ${errorMsg}`,
        results: []
      };
    }

    const totalTime = Date.now() - startTime;

    // Parse results - prefer the stream that contains TEST_* lines
    const stdout = executionResult.stdout || '';
    const stderr = executionResult.stderr || '';
    const fileResults = await readResultsFile(resultsPath, testCases, stderr);
    const output = fileResults ? '' : selectTestOutput(stdout, stderr);
    
    const results = fileResults || await parseTestResults(output, testCases, stderr);

    // Cleanup - delete all files in the temp directory (including inner class files)
    try {
      const files = await readdir(TEMP_DIR);
      const deletePromises = files
        .filter(file => file.startsWith(className))
        .map(file => unlink(join(TEMP_DIR, file)).catch(() => {}));
      await Promise.all(deletePromises);
    } catch (cleanupErr) {
      // Ignore cleanup errors
    }

    return {
      success: true,
      results,
      totalTime
    };

  } catch (error) {
    // Cleanup on error - delete all files in the temp directory
    try {
      if (TEMP_DIR) {
        const files = await readdir(TEMP_DIR).catch(() => []);
        const deletePromises = files
          .filter(file => file.startsWith(className))
          .map(file => unlink(join(TEMP_DIR, file)).catch(() => {}));
        await Promise.all(deletePromises);
      }
    } catch (cleanupErr) {
      // Ignore cleanup errors
    }

    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      results: []
    };
  }
}

const TEST_RESULT_LINE = /^TEST_\d+_(ACTUAL|EXPECTED|RESULT|TIME|STDOUT):/;

function selectTestOutput(stdout, stderr) {
  const hasTestLines = (value) => value && value.split(/\r?\n/).some(line => TEST_RESULT_LINE.test(line));
  if (hasTestLines(stderr)) {
    return stderr;
  }
  if (hasTestLines(stdout)) {
    return stdout;
  }
  return stderr || stdout || '';
}

function stripTestResultLines(text = '') {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text
    .split(/\r?\n/)
    .filter(line => !TEST_RESULT_LINE.test(line))
    .join('\n');
}

function extractTestErrors(stderr = '', testCount = 0) {
  const testErrors = {};
  const errorText = stripTestResultLines(stderr);
  for (let i = 0; i < testCount; i++) {
    const javaTestNumber = i + 1; // Convert 0-based index to 1-based test number
    const errorStartPattern = `ERROR in test ${javaTestNumber} (method invocation):`;
    const errorStartIndex = errorText.indexOf(errorStartPattern);
    if (errorStartIndex !== -1) {
      const nextErrorPattern = `ERROR in test ${javaTestNumber + 1} (method invocation):`;
      const nextErrorIndex = errorText.indexOf(nextErrorPattern, errorStartIndex + 1);
      const errorEndIndex = nextErrorIndex !== -1 ? nextErrorIndex : errorText.length;
      const errorSection = errorText.substring(errorStartIndex, errorEndIndex);
      const cleanedError = errorSection
        .split('\n')
        .filter(line => !line.includes('[DEBUG]'))
        .join('\n')
        .trim();
      testErrors[i] = cleanedError || errorSection.trim();
    }
  }
  return testErrors;
}

async function readResultsFile(resultsPath, testCases, stderr = '') {
  try {
    const raw = await readFile(resultsPath, 'utf8');
    if (!raw) {
      return null;
    }
    const payload = JSON.parse(raw);
    const rawResults = Array.isArray(payload) ? payload : payload?.results;
    if (!Array.isArray(rawResults)) {
      return null;
    }
    const testErrors = extractTestErrors(stderr, testCases.length);
    return testCases.map((testCase, index) => {
      const entry = rawResults[index] || {};
      const durationMs = Number.isFinite(entry.durationMs)
        ? entry.durationMs
        : Number.parseInt(entry.durationMs ?? entry.executionTime ?? entry.timeMs, 10) || 0;
      return {
        testCase,
        actual: entry.actual ?? entry.actualStr ?? null,
        expected: entry.expected ?? entry.expectedStr ?? null,
        passed: typeof entry.passed === 'boolean' ? entry.passed : false,
        executionTime: durationMs,
        stdout: entry.stdout ?? entry.stdoutValue ?? '',
        error: entry.error ?? testErrors[index] ?? null
      };
    });
  } catch {
    return null;
  }
}

async function parseTestResults(output, testCases, stderr = '') {
  const results = [];
  const testErrors = extractTestErrors(stderr, testCases.length);
  
  if (!output || typeof output !== 'string') {
    // Return results with null values if output is invalid
    for (let i = 0; i < testCases.length; i++) {
      results.push({
        testCase: testCases[i],
        actual: null,
        expected: null,
        passed: false,
        executionTime: 0,
        stdout: '',
        error: testErrors[i] || null
      });
    }
    return results;
  }

  // Split by newline, but also handle cases where output might be on single line
  // Try both \n and \r\n
  // Keep empty lines for stdout parsing (they might be part of stdout output)
  const allLines = output.split(/\r?\n/);
  const lines = allLines.filter(line => line.trim().length > 0);
  
  for (let i = 0; i < testCases.length; i++) {
    // Try to find lines - be more flexible with matching
    const actualLine = lines.find(line => {
      const trimmed = line.trim();
      return trimmed.startsWith(`TEST_${i}_ACTUAL:`) || trimmed.includes(`TEST_${i}_ACTUAL:`);
    });
    const expectedLine = lines.find(line => {
      const trimmed = line.trim();
      return trimmed.startsWith(`TEST_${i}_EXPECTED:`) || trimmed.includes(`TEST_${i}_EXPECTED:`);
    });
    const resultLine = lines.find(line => {
      const trimmed = line.trim();
      return trimmed.startsWith(`TEST_${i}_RESULT:`) || trimmed.includes(`TEST_${i}_RESULT:`);
    });
    const timeLine = lines.find(line => {
      const trimmed = line.trim();
      return trimmed.startsWith(`TEST_${i}_TIME:`) || trimmed.includes(`TEST_${i}_TIME:`);
    });
    
    // Find stdout line index in allLines (including empty lines)
    const stdoutLineIndex = allLines.findIndex(line => {
      const trimmed = line.trim();
      return trimmed.startsWith(`TEST_${i}_STDOUT:`) || trimmed.includes(`TEST_${i}_STDOUT:`);
    });

    let actualSerialized = null;
    let expectedSerialized = null;
    let validationResult = null;
    let executionTime = 0;
    let stdout = '';

    if (actualLine) {
      // Extract value after the prefix, handling cases where prefix might be in middle of line
      const match = actualLine.match(new RegExp(`TEST_${i}_ACTUAL:(.+)`));
      if (match && match[1]) {
        actualSerialized = match[1].trim();
      } else {
        // Fallback to simple replace
        actualSerialized = actualLine.replace(`TEST_${i}_ACTUAL:`, '').trim();
      }
    }

    if (expectedLine) {
      // Extract value after the prefix, handling cases where prefix might be in middle of line
      const match = expectedLine.match(new RegExp(`TEST_${i}_EXPECTED:(.+)`));
      if (match && match[1]) {
        expectedSerialized = match[1].trim();
      } else {
        // Fallback to simple replace
        expectedSerialized = expectedLine.replace(`TEST_${i}_EXPECTED:`, '').trim();
      }
    }

    if (resultLine) {
      const match = resultLine.match(new RegExp(`TEST_${i}_RESULT:(.+)`));
      if (match && match[1]) {
        validationResult = match[1].trim();
      } else {
        validationResult = resultLine.replace(`TEST_${i}_RESULT:`, '').trim();
      }
    }

    if (timeLine) {
      const match = timeLine.match(new RegExp(`TEST_${i}_TIME:(.+)`));
      if (match && match[1]) {
        executionTime = parseInt(match[1].trim()) || 0;
      } else {
        executionTime = parseInt(timeLine.replace(`TEST_${i}_TIME:`, '').trim()) || 0;
      }
    }

    // Parse stdout - it may span multiple lines
    if (stdoutLineIndex >= 0) {
      const stdoutLine = allLines[stdoutLineIndex];
      // Extract content after TEST_X_STDOUT: prefix
      const prefixMatch = stdoutLine.match(new RegExp(`TEST_${i}_STDOUT:(.*)`));
      const stdoutParts = [];
      
      if (prefixMatch) {
        // Get content after prefix on the same line
        if (prefixMatch[1]) {
          stdoutParts.push(prefixMatch[1]);
        }
        
        // Collect all subsequent lines until we hit the next TEST_X_ prefix
        for (let j = stdoutLineIndex + 1; j < allLines.length; j++) {
          const nextLine = allLines[j];
          // Check if this line starts a new test result field
          if (nextLine.match(/^TEST_\d+_(ACTUAL|EXPECTED|RESULT|TIME|STDOUT):/)) {
            break;
          }
          stdoutParts.push(nextLine);
        }
      } else {
        // Fallback: just get content after prefix
        stdoutParts.push(stdoutLine.replace(`TEST_${i}_STDOUT:`, ''));
      }
      
      stdout = stdoutParts.join('\n');
    }

    // Check if validation passed
    const passed = validationResult === 'PASS';
    
    const resultObj = {
      testCase: testCases[i],
      actual: actualSerialized,
      expected: expectedSerialized,
      passed,
      executionTime,
      stdout: stdout || '',  // Include captured stdout
      error: testErrors[i] || null  // Include exception/error information from stderr
    };
    results.push(resultObj);
  }

  return results;
}

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;

    if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      if (obj1[key].length !== obj2[key].length) return false;
      for (let i = 0; i < obj1[key].length; i++) {
        if (!deepEqual(obj1[key][i], obj2[key][i])) return false;
      }
    } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      if (!deepEqual(obj1[key], obj2[key])) return false;
    } else if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

export const __testUtils = {
  spawnAsync,
  getTempDir,
  ensureTempDir,
  findJavaInstallation,
  detectWrapperClass,
  makeClassesStatic,
  removeInnerClassIfTopLevelExists,
  extractClassNameFromTemplate,
  parseTestResults,
  readResultsFile,
  extractTestErrors,
  deepEqual
};
