import { describe, test, expect, beforeAll } from '@jest/globals';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let testables;

beforeAll(async () => {
  ({ __testables: testables } = await import('../server.js'));
});

describe('Server helper utilities', () => {
  test('normalizeLanguage handles variants', () => {
    expect(testables.normalizeLanguage()).toBe('java');
    expect(testables.normalizeLanguage(' PYTHON ')).toBe('python');
    expect(testables.normalizeLanguage('js')).toBe('javascript');
    expect(testables.normalizeLanguage('TypeScript')).toBe('typescript');
    expect(testables.normalizeLanguage('kotlin')).toBe('java');
  });

  test('stripHtml removes tags and entities', () => {
    expect(testables.stripHtml()).toBe('');
    expect(testables.stripHtml('<div>Hello&nbsp;World &amp; &lt;ok&gt;</div>')).toBe('Hello World & <ok>');
  });

  test('normalizeChallengeName provides a readable fallback', () => {
    expect(testables.normalizeChallengeName()).toBe('Unknown');
    expect(testables.normalizeChallengeName('two_sum')).toBe('Two Sum');
  });

  test('language-based paths and templates resolve correctly', () => {
    const challenge = { adapter: './adapters/twoSumAdapter.js' };

    expect(testables.getLanguageAdapterPath(challenge, 'python')).toBe('./adapters/python/twoSumAdapter.js');
    expect(testables.getLanguageAdapterPath(challenge, 'javascript')).toBe('./adapters/javascript/twoSumAdapter.js');
    expect(testables.getLanguageAdapterPath(challenge, 'typescript')).toBe('./adapters/typescript/twoSumAdapter.js');
    expect(testables.getLanguageAdapterPath(challenge, 'java')).toBe('./adapters/twoSumAdapter.js');

    expect(testables.getTemplateFilename('python')).toBe('template.py');
    expect(testables.getTemplateFilename('javascript')).toBe('template.js');
    expect(testables.getTemplateFilename('typescript')).toBe('template.ts');
    expect(testables.getTemplateFilename('java')).toBe('template.java');
  });

  test('getTechBarDescriptionText caches and handles missing files', async () => {
    const folder = `tech_bar_desc_${randomUUID()}`;
    const dataDir = join(__dirname, '../../../data', folder);
    const descriptionPath = join(dataDir, 'description.html');

    await rm(dataDir, { recursive: true, force: true });
    await mkdir(dataDir, { recursive: true });
    await writeFile(descriptionPath, '<p>Hello&nbsp;World</p>', 'utf8');

    const firstRead = await testables.getTechBarDescriptionText(folder);
    expect(firstRead).toBe('Hello World');

    await rm(dataDir, { recursive: true, force: true });
    const cachedRead = await testables.getTechBarDescriptionText(folder);
    expect(cachedRead).toBe('Hello World');

    const missingRead = await testables.getTechBarDescriptionText(`missing_${randomUUID()}`);
    expect(missingRead).toBe('');

    const emptyRead = await testables.getTechBarDescriptionText();
    expect(emptyRead).toBe('');
  });

  test('evaluateTechBarLabel validates OpenAI responses', async () => {
    const makeClient = (content) => ({
      chat: {
        completions: {
          create: async () => ({
            choices: [{ message: { content } }]
          })
        }
      }
    });

    await expect(
      testables.evaluateTechBarLabel({
        client: makeClient('   '),
        challengeName: 'Two Sum',
        descriptionText: 'desc',
        solution: 'code'
      })
    ).rejects.toThrow('OpenAI response missing content');

    await expect(
      testables.evaluateTechBarLabel({
        client: makeClient('not-json'),
        challengeName: 'Two Sum',
        descriptionText: 'desc',
        solution: 'code'
      })
    ).rejects.toThrow('Failed to parse OpenAI JSON');

    await expect(
      testables.evaluateTechBarLabel({
        client: makeClient('{"label":"nope"}'),
        challengeName: 'Two Sum',
        descriptionText: 'desc',
        solution: 'code'
      })
    ).rejects.toThrow('Invalid label from OpenAI');

    const label = await testables.evaluateTechBarLabel({
      client: makeClient('{"label":"met"}'),
      challengeName: 'Two Sum',
      descriptionText: 'desc',
      solution: 'code'
    });
    expect(label).toBe('met');
  });

  test('updateTechBarInFile handles missing files and updates', async () => {
    const folder = `tech_bar_${randomUUID()}`;
    const dataDir = join(__dirname, '../../../data', folder);
    const submissionsPath = join(dataDir, 'submissions.json');

    await rm(dataDir, { recursive: true, force: true });
    const missingFile = await testables.updateTechBarInFile({
      submissionId: 'sub-1',
      challengeFolder: folder,
      status: 'completed',
      label: 'met'
    });
    expect(missingFile).toBe(false);

    await mkdir(dataDir, { recursive: true });
    await writeFile(
      submissionsPath,
      JSON.stringify([
        { id: 'sub-1', techBarStatus: 'pending', techBarLabel: null }
      ], null, 2),
      'utf8'
    );

    const updated = await testables.updateTechBarInFile({
      submissionId: 'sub-1',
      challengeFolder: folder,
      status: 'completed',
      label: 'met'
    });
    expect(updated).toBe(true);

    const updatedPayload = JSON.parse(await readFile(submissionsPath, 'utf8'));
    expect(updatedPayload[0].techBarStatus).toBe('completed');
    expect(updatedPayload[0].techBarLabel).toBe('met');

    const missingId = await testables.updateTechBarInFile({
      submissionId: 'missing',
      challengeFolder: folder,
      status: 'completed',
      label: 'met'
    });
    expect(missingId).toBe(false);

    await rm(dataDir, { recursive: true, force: true });
  });

  test('buildProgressSummary aggregates mixed submissions', () => {
    const summary = testables.buildProgressSummary([
      null,
      {
        challengeName: 'Two Sum',
        language: 'JavaScript',
        guidanceLevel: 'Guided',
        avgTime: 100,
        timerTime: 200,
        date: '2024-01-02T00:00:00Z'
      },
      {
        challenge: 'contains_duplicate',
        language: ' ',
        guidanceLevel: '',
        avgTime: -1,
        timerTime: -1,
        date: 'invalid-date'
      },
      {
        challenge: '',
        language: null,
        guidanceLevel: 'Minor',
        avgTime: 50,
        timerTime: Number.NaN,
        date: '2024-01-03T00:00:00Z'
      }
    ]);

    expect(summary.totalSubmissions).toBe(4);
    expect(summary.uniqueChallenges).toBe(3);
    expect(summary.avgRuntimeMs).toBe(75);
    expect(summary.totalTimerTimeMs).toBe(200);
    expect(summary.untrackedTimerCount).toBe(1);
    expect(summary.languageBreakdown.some((entry) => entry.language === 'javascript')).toBe(true);
    expect(summary.languageBreakdown.some((entry) => entry.language === 'unknown')).toBe(true);
    expect(summary.guidanceBreakdown.Guided).toBe(1);
    expect(summary.guidanceBreakdown.Independent).toBe(1);
    expect(summary.guidanceBreakdown.Minor).toBe(1);
    expect(summary.lastSubmission.startsWith('2024-01-03')).toBe(true);
  });

  test('buildTopicFitnessCore computes topic metrics', () => {
    const challenges = [
      { id: 'c1', topics: '["Arrays", " Hash "]', difficulty: 'easy' },
      { id: 'c2', topics: 'not-json', difficulty: 'medium' },
      { id: 'c3', topics: '["Graphs"]', difficulty: 'unknown' }
    ];

    const submissions = [
      {
        challenge_id: 'c1',
        guidance_level: 'Independent',
        submit_attempts: 2,
        timer_time: 60000,
        avg_time: 120000,
        date: '2024-01-01T00:00:00Z'
      },
      {
        challenge_id: 'c1',
        guidance_level: 'Unknown',
        submit_attempts: 0,
        timer_time: -1,
        avg_time: 30000,
        date: 'invalid-date'
      },
      {
        challenge_id: 'c1',
        guidance_level: 'Guided',
        submit_attempts: 'bad',
        timer_time: Number.NaN,
        avg_time: -5,
        date: '2024-01-02T00:00:00Z'
      },
      {
        challenge_id: 'c2',
        guidance_level: 'Minor',
        submit_attempts: 1,
        timer_time: 1000,
        avg_time: 0,
        date: '2024-01-03T00:00:00Z'
      },
      {
        challenge_id: 'c3',
        guidance_level: 'Minor',
        submit_attempts: 1,
        timer_time: 1000,
        avg_time: 0,
        date: '2024-01-03T00:00:00Z'
      },
      {
        challenge_id: 'missing',
        guidance_level: 'Minor',
        submit_attempts: 1,
        timer_time: 1000,
        avg_time: 0,
        date: '2024-01-03T00:00:00Z'
      }
    ];

    const topics = testables.buildTopicFitnessCore(challenges, submissions);
    const arrays = topics.find((entry) => entry.topic === 'Arrays');
    const hash = topics.find((entry) => entry.topic === 'Hash');

    expect(arrays).toBeDefined();
    expect(hash).toBeDefined();
    expect(arrays.easy.submissionCount).toBeGreaterThan(0);
    expect(arrays.overallSubmissionCount).toBeGreaterThan(0);
  });

  test('buildTopicFitnessWithTransfer applies carryover', () => {
    const challenges = [
      { id: 'c1', topics: '["Arrays"]', difficulty: 'easy' }
    ];

    const submissions = [
      {
        challenge_id: 'c1',
        language: 'java',
        guidance_level: 'Independent',
        submit_attempts: 1,
        timer_time: 1000,
        avg_time: 0,
        date: '2024-01-01T00:00:00Z'
      },
      {
        challenge_id: 'c1',
        language: 'python',
        guidance_level: 'Minor',
        submit_attempts: 2,
        timer_time: 2000,
        avg_time: 0,
        date: '2024-01-02T00:00:00Z'
      },
      {
        challenge_id: 'missing',
        language: 'python',
        guidance_level: 'Minor',
        submit_attempts: 0,
        timer_time: -1,
        avg_time: -1,
        date: 'invalid-date'
      }
    ];

    const javascriptFitness = testables.buildTopicFitnessWithTransfer(challenges, submissions, 'javascript');
    const javaFitness = testables.buildTopicFitnessWithTransfer(challenges, submissions, 'java');

    expect(javascriptFitness.length).toBe(1);
    expect(javascriptFitness[0].topic).toBe('Arrays');
    expect(javascriptFitness[0].easy).toBeDefined();
    expect(javascriptFitness[0].overallFitness).toBeUndefined();

    expect(javaFitness.length).toBe(1);
    expect(javaFitness[0].easy.fitness).toBeGreaterThanOrEqual(0);
  });

  test('getLanguageSimilarity and onboarding ramp apply fallbacks', () => {
    expect(testables.getLanguageSimilarity('java', 'java')).toBe(1);
    expect(testables.getLanguageSimilarity('python', 'java')).toBeGreaterThan(0);
    expect(testables.getOnboardingRamp('bad')).toBeGreaterThan(0);
    expect(testables.getOnboardingRamp(0)).toBeGreaterThan(0);
    expect(testables.getOnboardingRamp(12)).toBeLessThanOrEqual(1);
  });

  test('buildFitnessSnapshotEntries skips missing details', () => {
    const entries = testables.buildFitnessSnapshotEntries([
      {
        topic: 'Arrays',
        easy: { fitness: 0.5, submissionCount: 1 },
        medium: null,
        hard: { fitness: 0.2, submissionCount: 0 }
      }
    ], 'java');

    expect(entries.some((entry) => entry.difficulty === 'easy')).toBe(true);
    expect(entries.some((entry) => entry.difficulty === 'medium')).toBe(false);
    expect(entries.some((entry) => entry.difficulty === 'hard')).toBe(true);
  });
});
