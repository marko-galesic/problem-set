// Requires OPENAI_API_KEY; optional OPENAI_MODEL (default: gpt-4o-mini).
import OpenAI from 'openai';
import { readFile, writeFile, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { initDatabase, closeDatabase, getDatabase } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '../../../data');
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const LABELS = new Set(['not_met', 'met', 'exceeds']);

function stripHtml(html) {
  if (!html) return '';
  const withoutTags = html.replace(/<[^>]*>/g, ' ');
  return withoutTags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function getOpenAiClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ apiKey });
}

async function evaluateTechBarLabel({
  client,
  model,
  challengeName,
  descriptionText,
  solution
}) {
  const systemPrompt = [
    'You are evaluating a coding interview submission against the Meta interview bar.',
    'Consider correctness, algorithmic approach, code quality, and overall interview readiness.',
    'Return only JSON with a single key "label" set to one of: not_met, met, exceeds.'
  ].join(' ');

  const userPrompt = [
    `Challenge: ${challengeName || 'Unknown'}`,
    descriptionText ? `Description: ${descriptionText}` : 'Description: (none provided)',
    'Submission:',
    solution
  ].join('\n\n');

  const response = await client.chat.completions.create({
    model,
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  const content = response.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('OpenAI response missing content');
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse OpenAI JSON: ${content}`);
  }

  const label = parsed?.label;
  if (!LABELS.has(label)) {
    throw new Error(`Invalid label from OpenAI: ${label}`);
  }

  return label;
}

async function loadChallengeDescriptions() {
  const cache = new Map();

  return async function getDescriptionText(folder) {
    if (cache.has(folder)) {
      return cache.get(folder);
    }

    const descriptionPath = join(DATA_DIR, folder, 'description.html');
    try {
      const html = await readFile(descriptionPath, 'utf8');
      const text = stripHtml(html);
      cache.set(folder, text);
      return text;
    } catch {
      cache.set(folder, '');
      return '';
    }
  };
}

function normalizeChallengeName(challengeId) {
  if (!challengeId) return 'Unknown';
  return challengeId
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

async function backfillDatabase() {
  initDatabase();
  const db = getDatabase();
  const client = getOpenAiClient();

  const challengeRows = db.prepare('SELECT id, name, folder FROM challenges').all();
  const challengeMap = new Map(
    challengeRows.map(row => [
      row.id,
      { name: row.name, folder: row.folder || row.id }
    ])
  );
  const getDescriptionText = await loadChallengeDescriptions(challengeMap);

  const rows = db.prepare(`
    SELECT id, challenge_id, solution, tech_bar_status
    FROM submissions
    WHERE tech_bar_status IS NULL OR tech_bar_status != 'completed'
  `).all();

  if (rows.length === 0) {
    console.log('No submissions require tech bar backfill in DB.');
    return;
  }

  const updateStmt = db.prepare(`
    UPDATE submissions
    SET tech_bar_status = ?, tech_bar_label = ?
    WHERE id = ?
  `);

  let evaluated = 0;
  let noSubmission = 0;
  let skipped = 0;

  for (const row of rows) {
    const solution = typeof row.solution === 'string' ? row.solution.trim() : '';
    if (!solution) {
      updateStmt.run('completed', 'no_submission', row.id);
      noSubmission += 1;
      continue;
    }

    if (!client) {
      console.error('Missing OPENAI_API_KEY; cannot evaluate submissions with solutions.');
      skipped += 1;
      continue;
    }

    const challengeInfo = challengeMap.get(row.challenge_id) || {};
    const challengeFolder = challengeInfo.folder || row.challenge_id;
    const challengeName = challengeInfo.name || normalizeChallengeName(row.challenge_id);
    const descriptionText = await getDescriptionText(challengeFolder);

    try {
      const label = await evaluateTechBarLabel({
        client,
        model: DEFAULT_MODEL,
        challengeName,
        descriptionText,
        solution
      });
      updateStmt.run('completed', label, row.id);
      evaluated += 1;
    } catch (error) {
      console.warn(`Failed to evaluate submission ${row.id}: ${error.message}`);
      skipped += 1;
    }
  }

  console.log(
    `DB backfill complete. Evaluated: ${evaluated}, no submission: ${noSubmission}, skipped: ${skipped}.`
  );
}

async function loadFileSubmissions() {
  const folders = await readdir(DATA_DIR);
  const results = [];

  for (const folder of folders) {
    const folderPath = join(DATA_DIR, folder);
    try {
      const stats = await stat(folderPath);
      if (!stats.isDirectory()) {
        continue;
      }
    } catch {
      continue;
    }

    const submissionsPath = join(folderPath, 'submissions.json');
    try {
      const content = await readFile(submissionsPath, 'utf8');
      const submissions = JSON.parse(content);
      if (!Array.isArray(submissions)) {
        continue;
      }
      results.push({ folder, submissionsPath, submissions });
    } catch {
      continue;
    }
  }

  return results;
}

async function backfillFiles() {
  const client = getOpenAiClient();
  const challengeFiles = await loadFileSubmissions();
  const getDescriptionText = await loadChallengeDescriptions();

  let evaluated = 0;
  let noSubmission = 0;
  let skipped = 0;
  let updatedFiles = 0;

  for (const entry of challengeFiles) {
    let updated = false;
    const descriptionText = await getDescriptionText(entry.folder);
    const challengeName = normalizeChallengeName(entry.folder);

    for (const submission of entry.submissions) {
      const status = submission.techBarStatus;
      if (status === 'completed') {
        continue;
      }

      const solution = typeof submission.solution === 'string' ? submission.solution.trim() : '';
      if (!solution) {
        submission.techBarStatus = 'completed';
        submission.techBarLabel = 'no_submission';
        noSubmission += 1;
        updated = true;
        continue;
      }

      if (!client) {
        console.error('Missing OPENAI_API_KEY; cannot evaluate submissions with solutions.');
        skipped += 1;
        continue;
      }

      try {
        const label = await evaluateTechBarLabel({
          client,
          model: DEFAULT_MODEL,
          challengeName,
          descriptionText,
          solution
        });
        submission.techBarStatus = 'completed';
        submission.techBarLabel = label;
        evaluated += 1;
        updated = true;
      } catch (error) {
        console.warn(`Failed to evaluate submission ${submission.id}: ${error.message}`);
        skipped += 1;
      }
    }

    if (updated) {
      await writeFile(entry.submissionsPath, JSON.stringify(entry.submissions, null, 2), 'utf8');
      updatedFiles += 1;
    }
  }

  console.log(
    `File backfill complete. Evaluated: ${evaluated}, no submission: ${noSubmission}, skipped: ${skipped}, files updated: ${updatedFiles}.`
  );
}

async function main() {
  try {
    await backfillDatabase();
  } catch (error) {
    console.warn(`DB backfill failed (${error.message}). Falling back to file-based submissions.`);
    await backfillFiles();
  } finally {
    closeDatabase();
  }
}

if (process.argv[1] && process.argv[1].includes('backfillTechBarSubmissions.js')) {
  main().catch(error => {
    console.error('Tech bar backfill failed:', error.message);
    process.exit(1);
  });
}
