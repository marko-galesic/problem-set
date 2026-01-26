import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { createAppTestClient } from '../utils/appTestClient.js';
import { getDatabase, closeDatabase } from '../../db/database.js';

describe('Language preference endpoints', () => {
  let app;
  let client;

  beforeAll(async () => {
    process.env.MOCK_EXECUTION = '1';
    await jest.resetModules();
    ({ app } = await import('../../server.js'));
    client = createAppTestClient(app);

    const db = getDatabase();
    db.prepare('DELETE FROM language_preferences WHERE challenge_id = ?')
      .run('__global__');
  });

  afterAll(() => {
    const db = getDatabase();
    db.prepare('DELETE FROM language_preferences WHERE challenge_id = ?')
      .run('__global__');
    closeDatabase();
  });

  test('stores and retrieves the selected language', async () => {
    const initialResponse = await client.get('/api/language-preference');
    expect(initialResponse.status).toBe(200);
    expect(initialResponse.body).toHaveProperty('language', null);

    const saveResponse = await client.post('/api/language-preference', {
      language: 'PYTHON'
    });

    expect(saveResponse.status).toBe(200);
    expect(saveResponse.body).toHaveProperty('success', true);
    expect(saveResponse.body).toHaveProperty('language', 'python');

    const storedResponse = await client.get('/api/language-preference');
    expect(storedResponse.status).toBe(200);
    expect(storedResponse.body).toHaveProperty('language', 'python');
  });
});
