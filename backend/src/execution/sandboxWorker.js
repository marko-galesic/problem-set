import { createStandardAdapter } from '../adapters/standardAdapterFactory.js';
import { loadAdapter } from '../adapters/index.js';
import { executeJavaCode } from '../executors/javaExecutor.js';
import { executePythonCode } from '../executors/pythonExecutor.js';
import { executeJavaScriptCode } from '../executors/javascriptExecutor.js';
import { executeTypeScriptCode } from '../executors/typescriptExecutor.js';
const PREFIX = '__PROBLEM_SET_RESULT__';
async function execute({ code, testCases, adapterPath, adapterDefinition, challengeId, language }) {
  const adapter = adapterDefinition ? createStandardAdapter(adapterDefinition, language === 'typescript' ? 'javascript' : language) : await loadAdapter(adapterPath);
  if (language === 'python') return executePythonCode(code, testCases, adapter, challengeId);
  if (language === 'javascript') return executeJavaScriptCode(code, testCases, adapter, challengeId);
  if (language === 'typescript') return executeTypeScriptCode(code, testCases, adapter, challengeId);
  return executeJavaCode(code, testCases, adapter, challengeId);
}
try {
  const raw = process.argv[2];
  if (!raw || Buffer.byteLength(raw) > 1024 * 1024) throw new Error('Invalid sandbox request');
  process.stdout.write(`${PREFIX}${JSON.stringify(await execute(JSON.parse(raw)))}\n`);
} catch (error) {
  process.stdout.write(`${PREFIX}${JSON.stringify({ success: false, error: error.message || 'Sandbox execution failed', results: [] })}\n`);
}
