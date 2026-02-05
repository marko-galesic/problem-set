import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { randomUUID } from 'crypto';
import { createAppTestClient } from '../utils/appTestClient.js';
import { getDatabase, closeDatabase } from '../../db/database.js';

const challengeId = `test_challenge_${randomUUID()}`;
const prereqId = `test_prereq_${randomUUID()}`;
const topic = `topic_${randomUUID()}`;

let app;
let client;
let submissionId;

async function waitForImmediate() {
  await new Promise((resolve) => setImmediate(resolve));
}

describe('API metadata and analytics endpoints', () => {
  beforeAll(async () => {
    process.env.MOCK_EXECUTION = '1';
    await jest.resetModules();
    ({ app } = await import('../../server.js'));
    client = createAppTestClient(app);

    const prereqResponse = await client.post('/api/challenges/register', {
      folder: prereqId,
      name: 'Prerequisite Challenge',
      test_file: './testCases/twoSumTests.js',
      adapter: 'standard:twoSum:java',
      difficulty: 'easy',
      topics: [topic]
    });

    if (prereqResponse.status !== 200) {
      throw new Error(`Failed to register prerequisite: ${prereqResponse.text}`);
    }

    const mainResponse = await client.post('/api/challenges/register', {
      folder: challengeId,
      name: 'Main Challenge',
      test_file: './testCases/twoSumTests.js',
      adapter: 'standard:twoSum:java',
      difficulty: 'easy',
      topics: [topic]
    });

    if (mainResponse.status !== 200) {
      throw new Error(`Failed to register challenge: ${mainResponse.text}`);
    }
  });

  afterAll(() => {
    const db = getDatabase();
    db.prepare('DELETE FROM challenge_prerequisites WHERE challenge_id IN (?, ?) OR prerequisite_id IN (?, ?)')
      .run(challengeId, prereqId, challengeId, prereqId);
    db.prepare('DELETE FROM challenge_company_tiers WHERE challenge_id IN (?, ?)')
      .run(challengeId, prereqId);
    db.prepare('DELETE FROM challenge_tree WHERE challenge_id IN (?, ?) OR parent_id IN (?, ?)')
      .run(challengeId, prereqId, challengeId, prereqId);
    db.prepare('DELETE FROM submissions WHERE challenge_id IN (?, ?)')
      .run(challengeId, prereqId);
    db.prepare('DELETE FROM fitness_history WHERE topic = ?')
      .run(topic);
    db.prepare('DELETE FROM challenges WHERE id IN (?, ?)')
      .run(challengeId, prereqId);
    closeDatabase();
  });

  test('rejects invalid challenge registration payload', async () => {
    const response = await client.post('/api/challenges/register', { folder: `bad_${randomUUID()}` });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('updates challenge metadata and relationships', async () => {
    const response = await client.post(`/api/challenges/${challengeId}/metadata`, {
      name: 'Main Challenge Updated',
      difficulty: 'easy',
      topics: [topic],
      parent_id: prereqId,
      display_order: 2,
      company_tiers: [
        { tier: 1, required: true },
        { tier: 2, required: false }
      ]
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
  });

  test('sets and reads prerequisites', async () => {
    const setResponse = await client.post(`/api/challenges/${challengeId}/prerequisites`, {
      prerequisite_ids: [prereqId]
    });

    expect(setResponse.status).toBe(200);
    expect(setResponse.body).toHaveProperty('success', true);

    const getResponse = await client.get(`/api/challenges/${challengeId}/prerequisites`);
    expect(getResponse.status).toBe(200);
    const prereqs = getResponse.body.prerequisites || [];
    expect(prereqs.some((item) => item.id === prereqId)).toBe(true);
  });

  test('validates prerequisite_ids payload', async () => {
    const response = await client.post(`/api/challenges/${challengeId}/prerequisites`, {
      prerequisite_ids: 'nope'
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('returns challenge metadata', async () => {
    const response = await client.get(`/api/challenges/${challengeId}/metadata`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', challengeId);
    expect(Array.isArray(response.body.company_tiers)).toBe(true);
  });

  test('returns 404 for missing challenge metadata', async () => {
    const response = await client.get(`/api/challenges/${randomUUID()}/metadata`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  test('returns challenge tree', async () => {
    const response = await client.get('/api/challenges/tree');
    expect(response.status).toBe(200);
    const tree = response.body.tree || [];
    const entry = tree.find((item) => item.id === challengeId);
    expect(entry).toBeDefined();
    expect(entry.parent_id).toBe(prereqId);
  });

  test('returns challenge graph for submitted challenges', async () => {
    const setResponse = await client.post(`/api/challenges/${challengeId}/prerequisites`, {
      prerequisite_ids: [prereqId]
    });
    expect(setResponse.status).toBe(200);

    const submissionResponse = await client.post('/api/submissions', {
      challenge: challengeId,
      avgTime: 950,
      timerTime: 1200,
      date: new Date().toISOString(),
      guidanceLevel: 'Independent',
      submitAttempts: 1,
      language: 'java'
    });

    expect(submissionResponse.status).toBe(200);

    const response = await client.get('/api/challenges/graph?language=java&scope=submitted&edges=prerequisite');
    expect(response.status).toBe(200);
    const nodes = response.body.nodes || [];
    const edges = response.body.edges || [];
    const nodeIds = nodes.map((node) => node.id);

    expect(nodeIds).toEqual(expect.arrayContaining([challengeId, prereqId]));
    expect(edges.some((edge) => edge.from === prereqId && edge.to === challengeId)).toBe(true);
    const mainNode = nodes.find((node) => node.id === challengeId);
    expect(mainNode?.hasSubmission).toBe(true);
  });

  test('returns challenges metadata list', async () => {
    const response = await client.get('/api/challenges/metadata');
    expect(response.status).toBe(200);
    const challenges = response.body.challenges || [];
    expect(challenges.some((item) => item.id === challengeId)).toBe(true);
  });

  test('loads test cases for registered challenge using db config', async () => {
    const response = await client.get(`/api/test-cases?challenge=${challengeId}&language=js`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.runTests)).toBe(true);
  });

  test('handles submissions, updates, and topic fitness endpoints', async () => {
    const submissionResponse = await client.post('/api/submissions', {
      challenge: challengeId,
      avgTime: 1200,
      timerTime: -1,
      date: new Date().toISOString(),
      guidanceLevel: 'Minor',
      submitAttempts: 2,
      language: 'JAVA'
    });

    expect(submissionResponse.status).toBe(200);
    expect(submissionResponse.body).toHaveProperty('success', true);
    submissionId = submissionResponse.body.submission?.id;
    expect(submissionId).toBeDefined();

    const updateResponse = await client.put('/api/submissions', {
      id: submissionId,
      timerTime: 3456,
      challenge: challengeId
    });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty('success', true);

    await waitForImmediate();

    const listResponse = await client.get(`/api/submissions?challenge=${challengeId}`);
    expect(listResponse.status).toBe(200);
    const listed = listResponse.body.submissions || [];
    const normalized = listed.find((item) => item.id === submissionId);
    expect(normalized?.language).toBe('java');

    const fitnessResponse = await client.get('/api/topic-fitness?language=java');
    expect(fitnessResponse.status).toBe(200);
    expect(Array.isArray(fitnessResponse.body.topics)).toBe(true);

    const encodedTopic = encodeURIComponent(topic);
    const historyResponse = await client.get(`/api/topic-fitness-history?topic=${encodedTopic}&difficulty=easy&limit=5&language=java`);
    expect(historyResponse.status).toBe(200);
    expect(Array.isArray(historyResponse.body.history)).toBe(true);
  });

  test('returns retention metrics views', async () => {
    const retentionResponse = await client.get('/api/retention-metrics?language=java&refresh=true');
    expect(retentionResponse.status).toBe(200);
    expect(Array.isArray(retentionResponse.body.metrics)).toBe(true);

    const topicRetentionResponse = await client.get('/api/retention-metrics/topics?language=java');
    expect(topicRetentionResponse.status).toBe(200);
    expect(Array.isArray(topicRetentionResponse.body.metrics)).toBe(true);
    expect(topicRetentionResponse.body.computedAt).toBeTruthy();
  });

  test('validates submission update payload', async () => {
    const response = await client.put('/api/submissions', { timerTime: 10 });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
