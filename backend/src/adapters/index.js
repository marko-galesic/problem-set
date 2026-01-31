/**
 * Adapter registry - loads and provides adapters for challenges
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initDatabase } from '../db/database.js';
import { getChallengeAdapterDefinition } from '../db/queries.js';
import { createStandardAdapter } from './standardAdapterFactory.js';
import { standardAdapterDefinitions } from './standardAdapterDefinitions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const adapterCache = new Map();

/**
 * Load an adapter for a challenge
 * @param {string} adapterPath - Path to the adapter module (relative to server.js)
 * @returns {Promise<Object>} The adapter object
 */
export async function loadAdapter(adapterPath) {
  if (adapterCache.has(adapterPath)) {
    return adapterCache.get(adapterPath);
  }

  try {
    if (adapterPath.startsWith('db-standard:')) {
      const parts = adapterPath.split(':');
      const challengeId = parts[1];
      const language = parts[2] || 'java';
      const normalizedLanguage = language === 'typescript' ? 'javascript' : language;

      initDatabase();
      const definition = getChallengeAdapterDefinition(challengeId);
      if (!definition) {
        throw new Error(`Missing adapter definition for ${challengeId}`);
      }

      const adapter = createStandardAdapter(definition, normalizedLanguage);
      adapterCache.set(adapterPath, adapter);
      return adapter;
    }
    if (adapterPath.startsWith('standard:')) {
      const parts = adapterPath.split(':');
      const adapterKey = parts[1];
      const language = parts[2] || 'java';
      const normalizedLanguage = language === 'typescript' ? 'javascript' : language;

      if (!adapterKey) {
        throw new Error('Missing standard adapter key');
      }

      const definition = standardAdapterDefinitions[adapterKey];
      if (!definition) {
        throw new Error(`Missing standard adapter definition for ${adapterKey}`);
      }

      const adapter = createStandardAdapter(definition, normalizedLanguage);
      adapterCache.set(adapterPath, adapter);
      return adapter;
    }

    // Resolve the adapter path relative to the server.js file location
    // adapterPath is like './adapters/challengeAdapter.js' relative to server.js (in src/)
    // We're in adapters/index.js, so we need to go up to src/ and then use the path
    const srcDir = dirname(__dirname); // Go up from adapters/ to src/
    let resolvedPath;
    
    if (adapterPath.startsWith('./')) {
      // Remove './' and resolve from src dir
      resolvedPath = join(srcDir, adapterPath.substring(2));
    } else {
      resolvedPath = adapterPath;
    }
    
    // For ES modules, we can use the resolved path directly
    // Convert to file:// URL format for cross-platform compatibility
    const adapterUrl = resolvedPath.startsWith('file://') 
      ? resolvedPath 
      : `file://${resolvedPath}`;
    
    const adapterModule = await import(adapterUrl);
    const adapter = adapterModule.default || adapterModule;
    adapterCache.set(adapterPath, adapter);
    return adapter;
  } catch (error) {
    throw new Error(`Failed to load adapter from ${adapterPath}: ${error.message}`);
  }
}

/**
 * Clear the adapter cache (useful for testing)
 */
export function clearCache() {
  adapterCache.clear();
}
