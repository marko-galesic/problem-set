import { executeJavaCode } from '../executors/javaExecutor.js';
import { executePythonCode } from '../executors/pythonExecutor.js';
import { executeJavaScriptCode } from '../executors/javascriptExecutor.js';
import { executeTypeScriptCode } from '../executors/typescriptExecutor.js';
import { getChallengeAdapterDefinition } from '../db/queries.js';
import { DockerSandboxRunner } from './sandboxRunner.js';

function languageOf(value) {
  return ['python', 'javascript', 'typescript'].includes(value) ? value : 'java';
}
async function executeDirectly({ code, testCases, adapter, challengeId, language }) {
  if (language === 'python') return executePythonCode(code, testCases, adapter, challengeId);
  if (language === 'javascript') return executeJavaScriptCode(code, testCases, adapter, challengeId);
  if (language === 'typescript') return executeTypeScriptCode(code, testCases, adapter, challengeId);
  return executeJavaCode(code, testCases, adapter, challengeId);
}
function definitionFor(adapterPath) {
  if (!adapterPath?.startsWith('db-standard:')) return null;
  const definition = getChallengeAdapterDefinition(adapterPath.split(':')[1]);
  if (!definition) throw new Error('Missing sandbox adapter definition');
  return definition;
}
export async function executeSubmission(input, { runner } = {}) {
  const backend = process.env.EXECUTION_BACKEND || (process.env.NODE_ENV === 'test' ? 'direct' : 'docker');
  const language = languageOf(input.language);
  if (backend === 'direct') {
    if (process.env.NODE_ENV !== 'test' && process.env.ALLOW_UNSAFE_DIRECT_EXECUTION !== '1') throw new Error('Direct execution is disabled outside test environments');
    return executeDirectly({ ...input, language });
  }
  if (backend !== 'docker') throw new Error(`Unsupported execution backend: ${backend}`);
  return (runner || new DockerSandboxRunner()).execute({
    code: input.code, testCases: input.testCases, adapterPath: input.adapterPath,
    adapterDefinition: definitionFor(input.adapterPath), challengeId: input.challengeId, language
  });
}
