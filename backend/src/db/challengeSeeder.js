import { readFile } from 'fs/promises';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database.js';
import {
  getChallengeById,
  getChallengeAdapterDefinition,
  upsertChallengeAdapterDefinition,
  getChallengeAsset,
  upsertChallengeAsset,
  getChallengeTestCases,
  replaceChallengeTestCases
} from './queries.js';
import { standardAdapterDefinitions } from '../adapters/standardAdapterDefinitions.js';
import { getHelperAssetType, loadTestCasesFromFile } from './challengeContent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SRC_DIR = resolve(__dirname, '..');
const ROOT_DIR = resolve(__dirname, '../../..');
const DATA_DIR = join(ROOT_DIR, 'data');

const LANGUAGES = ['java', 'python', 'javascript', 'typescript'];
const HELPERS = ['TreeNode', 'ListNode', 'Node', 'AttrResult'];

function resolveAdapterPath(adapterPath) {
  if (!adapterPath) {
    return null;
  }
  const resolved = adapterPath.startsWith('./')
    ? resolve(SRC_DIR, adapterPath.substring(2))
    : resolve(SRC_DIR, adapterPath);
  return resolved;
}

async function readFileSafe(filePath) {
  if (!filePath) {
    return null;
  }
  try {
    return await readFile(filePath, 'utf8');
  } catch {
    return null;
  }
}

function extractStandardDefinitionKey(adapterSource) {
  if (!adapterSource) {
    return null;
  }
  const match = adapterSource.match(/createStandardAdapter\(\s*standardAdapterDefinitions\.([A-Za-z0-9_]+)/);
  return match?.[1] || null;
}

export async function seedStandardAdapterDefinition({ challengeId, adapterPath }) {
  if (!challengeId) {
    return { seeded: false };
  }

  initDatabase();
  if (getChallengeAdapterDefinition(challengeId)) {
    return { seeded: false };
  }

  const resolvedPath = resolveAdapterPath(adapterPath);
  const adapterSource = await readFileSafe(resolvedPath);
  const definitionKey = extractStandardDefinitionKey(adapterSource);
  if (!definitionKey) {
    return { seeded: false };
  }

  const definition = standardAdapterDefinitions[definitionKey];
  if (!definition) {
    return { seeded: false };
  }

  upsertChallengeAdapterDefinition(challengeId, definition);
  return { seeded: true, definitionKey };
}

export async function seedChallengeAssetsFromFiles({ challengeId, folder }) {
  if (!challengeId || !folder) {
    return { seeded: 0 };
  }

  initDatabase();
  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    return { seeded: 0 };
  }

  let seeded = 0;

  const descriptionPath = join(DATA_DIR, folder, 'description.html');
  const descriptionContent = await readFileSafe(descriptionPath);
  if (descriptionContent) {
    const existing = getChallengeAsset(challengeId, 'description_html', '');
    if (!existing) {
      upsertChallengeAsset({
        challenge_id: challengeId,
        type: 'description_html',
        language: '',
        content: descriptionContent
      });
      seeded += 1;
    }
  }

  for (const language of LANGUAGES) {
    const extension = language === 'python'
      ? 'py'
      : language === 'typescript'
        ? 'ts'
        : language === 'javascript'
          ? 'js'
          : 'java';
    const templatePath = join(DATA_DIR, folder, `template.${extension}`);
    const goldenPath = join(DATA_DIR, folder, `Golden.${extension}`);

    const templateContent = await readFileSafe(templatePath);
    if (templateContent) {
      const existing = getChallengeAsset(challengeId, 'template', language);
      if (!existing) {
        upsertChallengeAsset({
          challenge_id: challengeId,
          type: 'template',
          language,
          content: templateContent
        });
        seeded += 1;
      }
    }

    const goldenContent = await readFileSafe(goldenPath);
    if (goldenContent) {
      const existing = getChallengeAsset(challengeId, 'golden', language);
      if (!existing) {
        upsertChallengeAsset({
          challenge_id: challengeId,
          type: 'golden',
          language,
          content: goldenContent
        });
        seeded += 1;
      }
    }

    for (const helperName of HELPERS) {
      const helperPath = join(DATA_DIR, folder, `${helperName}.${extension}`);
      const helperContent = await readFileSafe(helperPath);
      if (!helperContent) {
        continue;
      }
      const helperType = getHelperAssetType(helperName);
      const existing = getChallengeAsset(challengeId, helperType, language);
      if (!existing) {
        upsertChallengeAsset({
          challenge_id: challengeId,
          type: helperType,
          language,
          content: helperContent
        });
        seeded += 1;
      }
    }
  }

  return { seeded };
}

export async function seedChallengeTestCasesFromFiles({ challengeId, challenge }) {
  if (!challengeId || !challenge?.testFile) {
    return { seeded: false };
  }

  initDatabase();
  const challengeRecord = getChallengeById(challengeId);
  if (!challengeRecord) {
    return { seeded: false };
  }

  const existingRun = getChallengeTestCases(challengeId, 'run');
  const existingSubmit = getChallengeTestCases(challengeId, 'submit');
  const hasRun = existingRun.length > 0;
  const hasSubmit = existingSubmit.length > 0;
  if (hasRun && hasSubmit) {
    return { seeded: false };
  }

  const { runTests, submitTests } = await loadTestCasesFromFile(challenge);
  if (!hasRun) {
    replaceChallengeTestCases(challengeId, 'run', runTests);
  }
  if (!hasSubmit) {
    replaceChallengeTestCases(challengeId, 'submit', submitTests);
  }

  return { seeded: true, run: !hasRun, submit: !hasSubmit };
}

export async function seedChallengeContentFromFiles({ challengeId, challenge }) {
  const [assetsResult, testsResult, adapterResult] = await Promise.all([
    seedChallengeAssetsFromFiles({ challengeId, folder: challenge.folder }),
    seedChallengeTestCasesFromFiles({ challengeId, challenge }),
    seedStandardAdapterDefinition({ challengeId, adapterPath: challenge.adapter })
  ]);

  return {
    assets: assetsResult,
    tests: testsResult,
    adapter: adapterResult
  };
}
