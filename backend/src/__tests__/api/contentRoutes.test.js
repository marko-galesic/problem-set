import express from 'express';
import request from 'supertest';
import { registerContentRoutes } from '../../routes/contentRoutes.js';

function createApp(overrides = {}) {
  const app = express();
  const calls = [];
  registerContentRoutes(app, {
    defaultChallenge: 'default_challenge',
    getChallenge: (id) => ({ folder: `folder-${id}` }),
    normalizeLanguage: (language) => language || 'java',
    getChallengeAssetContent: async (options) => {
      calls.push(options);
      return options.type === 'template' ? 'class Solution {}' : '<p>Description</p>';
    },
    loadTestCases: async () => ({
      runTests: [{ id: 'r1', name: 'run', input: { values: [1, 2] } }],
      submitTests: [{ id: 's1', name: 'submit', value: 7 }]
    }),
    getLanguageAdapterPath: () => 'adapter-path',
    loadAdapter: async () => ({
      extractInput: (test) => ({ value: test.value })
    }),
    logger: { error: () => {} },
    ...overrides
  });
  return { app, calls };
}

describe('content route boundary', () => {
  it('keeps the health contract independent of challenge dependencies', async () => {
    const { app } = createApp({ getChallenge: () => { throw new Error('unused'); } });

    await request(app).get('/api/health').expect(200, { status: 'ok' });
  });

  it('uses injected challenge content dependencies for templates and descriptions', async () => {
    const { app, calls } = createApp();

    await request(app).get('/api/template?challenge=two_sum&language=python')
      .expect(200, { code: 'class Solution {}' });
    await request(app).get('/api/description?challenge=two_sum')
      .expect(200, { description: '<p>Description</p>' });

    expect(calls).toEqual([
      expect.objectContaining({ challengeId: 'two_sum', folder: 'folder-two_sum', type: 'template', language: 'python' }),
      expect.objectContaining({ challengeId: 'two_sum', folder: 'folder-two_sum', type: 'description_html' })
    ]);
  });

  it('preserves content-route error contracts', async () => {
    const { app } = createApp({
      getChallengeAssetContent: async () => {
        throw new Error('asset unavailable');
      }
    });

    await request(app).get('/api/template').expect(500, { error: 'asset unavailable' });
    await request(app).get('/api/description').expect(500, { error: 'asset unavailable' });
  });

  it('normalizes test-case previews without returning expected outputs', async () => {
    const { app } = createApp();

    const response = await request(app).get('/api/test-cases?challenge=two_sum&language=js').expect(200);

    expect(response.body).toEqual({
      runTests: [{ id: 'r1', name: 'run', input: JSON.stringify({ values: [1, 2] }) }],
      submitTests: [{ id: 's1', name: 'submit', input: 7 }]
    });
  });
});
