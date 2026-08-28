import { readFile, appendFile, mkdir } from 'fs/promises';
import { join, dirname, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { initDatabase } from './database.js';
import {
  getChallengeById,
  getChallengeAsset,
  upsertChallengeAsset,
  getChallengeTestCases,
  replaceChallengeTestCases
} from './queries.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '../../../data');
const LOG_DIR = join(__dirname, '../../../logs');
const LOG_PATH = join(LOG_DIR, 'challenge-source.log');
const SRC_DIR = resolve(__dirname, '..');

const LANGUAGE_EXTENSIONS = {
  java: 'java',
  python: 'py',
  javascript: 'js',
  typescript: 'ts'
};

function normalizeLanguage(value) {
  if (!value) {
    return 'java';
  }
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'python') return 'python';
  if (normalized === 'javascript' || normalized === 'js') return 'javascript';
  if (normalized === 'typescript' || normalized === 'ts') return 'typescript';
  return 'java';
}

async function writeSourceLog(entry) {
  if (process.env.DISABLE_CHALLENGE_SOURCE_LOG || process.env.NODE_ENV === 'test') {
    return;
  }
  try {
    await mkdir(LOG_DIR, { recursive: true });
    const line = `${JSON.stringify({ ts: new Date().toISOString(), ...entry })}\n`;
    await appendFile(LOG_PATH, line, 'utf8');
  } catch {
    // Ignore logging failures.
  }
}

function logAssetSource({ challengeId, type, language, source }) {
  return writeSourceLog({
    kind: 'asset',
    challengeId: challengeId || null,
    type,
    language: language || null,
    source
  });
}

function logTestCaseSource({ challengeId, mode, source }) {
  return writeSourceLog({
    kind: 'testcases',
    challengeId: challengeId || null,
    mode,
    source
  });
}

function resolveFolder(challengeId, folderOverride) {
  if (folderOverride) {
    return folderOverride;
  }
  if (!challengeId) {
    return null;
  }
  try {
    initDatabase();
    const record = getChallengeById(challengeId);
    if (record?.folder) {
      return record.folder;
    }
  } catch {
    // Ignore DB lookup failures; fall back to challengeId.
  }
  return challengeId;
}

function buildAssetFilename(type, language) {
  if (type === 'description_html') {
    return 'description.html';
  }

  if (type === 'interviewer_notes_html') {
    return 'interviewer-notes.html';
  }

  const extension = LANGUAGE_EXTENSIONS[normalizeLanguage(language)] || 'java';

  if (type === 'template') {
    return `template.${extension}`;
  }

  if (type === 'golden') {
    return `Golden.${extension}`;
  }

  if (type.startsWith('helper:')) {
    const helperName = type.slice('helper:'.length);
    return `${helperName}.${extension}`;
  }

  return null;
}

function resolveAssetPath(folder, type, language) {
  if (!folder) {
    return null;
  }
  const filename = buildAssetFilename(type, language);
  if (!filename) {
    return null;
  }
  return join(DATA_DIR, folder, filename);
}

async function readFileIfExists(filePath) {
  if (!filePath) {
    return null;
  }
  try {
    return await readFile(filePath, 'utf8');
  } catch {
    return null;
  }
}

async function shouldSeedAsset(challengeId) {
  if (!challengeId) {
    return false;
  }
  try {
    initDatabase();
    return Boolean(getChallengeById(challengeId));
  } catch {
    return false;
  }
}

export function getHelperAssetType(name) {
  return `helper:${name}`;
}

export async function getChallengeAssetContent({
  challengeId,
  folder,
  type,
  language,
  seed = true,
  preferFile = false
}) {
  const normalizedLanguage = language ? normalizeLanguage(language) : '';
  const resolvedFolder = resolveFolder(challengeId, folder);

  if (preferFile) {
    const filePath = resolveAssetPath(resolvedFolder, type, normalizedLanguage);
    const fileContent = await readFileIfExists(filePath);
    if (fileContent) {
      void logAssetSource({
        challengeId,
        type,
        language: normalizedLanguage,
        source: 'file'
      });
      if (seed && challengeId && (await shouldSeedAsset(challengeId))) {
        try {
          upsertChallengeAsset({
            challenge_id: challengeId,
            type,
            language: normalizedLanguage,
            content: fileContent
          });
        } catch {
          // Ignore seed failures; return file content.
        }
      }
      return fileContent;
    }
  }

  if (challengeId) {
    try {
      initDatabase();
      const record = getChallengeAsset(challengeId, type, normalizedLanguage);
      if (record?.content) {
        void logAssetSource({
          challengeId,
          type,
          language: normalizedLanguage,
          source: 'db'
        });
        return record.content;
      }
    } catch {
      // Ignore DB failures; fall back to file.
    }
  }

  const filePath = resolveAssetPath(resolvedFolder, type, normalizedLanguage);
  const content = await readFileIfExists(filePath);
  if (!content) {
    return null;
  }

  void logAssetSource({
    challengeId,
    type,
    language: normalizedLanguage,
    source: 'file'
  });

  if (seed && challengeId && (await shouldSeedAsset(challengeId))) {
    try {
      upsertChallengeAsset({
        challenge_id: challengeId,
        type,
        language: normalizedLanguage,
        content
      });
    } catch {
      // Ignore seed failures; return content from file.
    }
  }

  return content;
}

export async function loadTestCasesFromFile(challenge) {
  if (!challenge?.testFile) {
    return { runTests: [], submitTests: [] };
  }

  const testFilePath = challenge.testFile.startsWith('./')
    ? resolve(SRC_DIR, challenge.testFile.substring(2))
    : resolve(SRC_DIR, challenge.testFile);
  const testFileUrl = pathToFileURL(testFilePath).href;
  const testModule = await import(testFileUrl);

  return {
    runTests: testModule.runTests || [],
    submitTests: testModule.submitTests || []
  };
}

export async function getChallengeTestCasesWithFallback({
  challengeId,
  challenge,
  seed = true
}) {
  initDatabase();

  const dbRunTests = getChallengeTestCases(challengeId, 'run');
  const dbSubmitTests = getChallengeTestCases(challengeId, 'submit');
  const hasRunTests = dbRunTests.length > 0;
  const hasSubmitTests = dbSubmitTests.length > 0;

  if (hasRunTests && hasSubmitTests) {
    void logTestCaseSource({ challengeId, mode: 'run', source: 'db' });
    void logTestCaseSource({ challengeId, mode: 'submit', source: 'db' });
    return { runTests: dbRunTests, submitTests: dbSubmitTests };
  }

  const { runTests, submitTests } = await loadTestCasesFromFile(challenge);

  if (seed && challengeId && (await shouldSeedAsset(challengeId))) {
    try {
      if (!hasRunTests) {
        replaceChallengeTestCases(challengeId, 'run', runTests);
      }
      if (!hasSubmitTests) {
        replaceChallengeTestCases(challengeId, 'submit', submitTests);
      }
    } catch {
      // Ignore seed failures; return file-based test cases.
    }
  }

  const runSource = hasRunTests ? 'db' : 'file';
  const submitSource = hasSubmitTests ? 'db' : 'file';
  void logTestCaseSource({ challengeId, mode: 'run', source: runSource });
  void logTestCaseSource({ challengeId, mode: 'submit', source: submitSource });

  return {
    runTests: hasRunTests ? dbRunTests : runTests,
    submitTests: hasSubmitTests ? dbSubmitTests : submitTests
  };
}

