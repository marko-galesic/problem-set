import { readFile } from 'fs/promises';
import { initDatabase, closeDatabase, getDatabase } from './database.js';
import { getChallengeById } from './queries.js';

const GRAPHQL_URL = 'https://leetcode.com/graphql/';
const SUBMISSION_LIST_QUERY = `
  query submissionList($offset: Int!, $limit: Int!, $lastKey: String, $questionSlug: String!, $lang: Int, $status: Int) {
    questionSubmissionList(
      offset: $offset
      limit: $limit
      lastKey: $lastKey
      questionSlug: $questionSlug
      lang: $lang
      status: $status
    ) {
      lastKey
      hasNext
      submissions {
        id
        title
        titleSlug
        status
        statusDisplay
        lang
        langName
        runtime
        timestamp
        url
        isPending
        memory
        hasNotes
        notes
        flagType
        frontendId
        topicTags {
          id
        }
      }
    }
  }
`;

function parseRuntimeMs(runtime) {
  if (typeof runtime === 'number' && Number.isFinite(runtime)) {
    return Math.round(runtime);
  }
  if (!runtime || typeof runtime !== 'string') {
    return null;
  }
  const trimmed = runtime.trim().toLowerCase();
  const value = parseFloat(trimmed);
  if (Number.isNaN(value)) {
    return null;
  }
  if (trimmed.includes('ms')) {
    return Math.round(value);
  }
  if (trimmed.includes('s')) {
    return Math.round(value * 1000);
  }
  return null;
}

function slugToChallengeId(slug) {
  return slug.replace(/-/g, '_');
}

function parseArgs(argv) {
  const options = {
    slugs: [],
    pageSize: 20,
    limit: null,
    includeNonAccepted: false,
    dryRun: false,
    slugsFile: null,
    submissionsFile: null
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--slugs' && argv[i + 1]) {
      options.slugs.push(...argv[i + 1].split(',').map(s => s.trim()).filter(Boolean));
      i += 1;
      continue;
    }
    if (arg === '--slug' && argv[i + 1]) {
      options.slugs.push(argv[i + 1].trim());
      i += 1;
      continue;
    }
    if (arg === '--slugs-file' && argv[i + 1]) {
      options.slugsFile = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--submissions-file' && argv[i + 1]) {
      options.submissionsFile = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--page-size' && argv[i + 1]) {
      options.pageSize = Math.max(1, Number(argv[i + 1]));
      i += 1;
      continue;
    }
    if (arg === '--limit' && argv[i + 1]) {
      options.limit = Math.max(1, Number(argv[i + 1]));
      i += 1;
      continue;
    }
    if (arg === '--include-non-accepted') {
      options.includeNonAccepted = true;
      continue;
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg.startsWith('--')) {
      continue;
    }
    options.slugs.push(arg.trim());
  }

  return options;
}

async function loadSlugsFromFile(filePath) {
  const content = await readFile(filePath, 'utf8');
  return content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .flatMap(line => line.split(',').map(slug => slug.trim()).filter(Boolean));
}

async function loadSubmissionsFromFile(filePath, slug) {
  const content = await readFile(filePath, 'utf8');
  const parsed = JSON.parse(content);

  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (parsed && typeof parsed === 'object' && slug && Array.isArray(parsed[slug])) {
    return parsed[slug];
  }

  throw new Error('Submissions file must be an array or an object keyed by slug.');
}

function buildHeaders(slug) {
  const cookie = process.env.LEETCODE_COOKIE;
  if (!cookie) {
    throw new Error('Missing LEETCODE_COOKIE env var (copy the Cookie header from your request).');
  }

  let csrfToken = process.env.LEETCODE_CSRF_TOKEN;
  if (!csrfToken) {
    const match = cookie.match(/csrftoken=([^;]+)/);
    csrfToken = match ? match[1] : null;
  }

  if (!csrfToken) {
    throw new Error('Missing LEETCODE_CSRF_TOKEN env var (or include csrftoken in LEETCODE_COOKIE).');
  }

  const headers = {
    accept: '*/*',
    'content-type': 'application/json',
    origin: 'https://leetcode.com',
    referer: `https://leetcode.com/problems/${slug}/submissions/`,
    'x-csrftoken': csrfToken,
    cookie
  };

  if (process.env.LEETCODE_AUTHORIZATION) {
    headers.authorization = process.env.LEETCODE_AUTHORIZATION;
  }

  if (process.env.LEETCODE_USER_AGENT) {
    headers['user-agent'] = process.env.LEETCODE_USER_AGENT;
  }

  return headers;
}

async function fetchSubmissions(slug, { pageSize, limit, includeNonAccepted }) {
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available. Use Node 18+ or provide a fetch polyfill.');
  }

  const submissions = [];
  let lastKey = null;
  let hasNext = true;

  while (hasNext) {
    const remaining = limit ? Math.max(limit - submissions.length, 0) : pageSize;
    const currentLimit = limit ? Math.min(pageSize, remaining) : pageSize;
    if (currentLimit <= 0) {
      break;
    }

    const body = {
      query: SUBMISSION_LIST_QUERY,
      variables: {
        questionSlug: slug,
        offset: 0,
        limit: currentLimit,
        lastKey
      },
      operationName: 'submissionList'
    };

    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: buildHeaders(slug),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LeetCode request failed (${response.status}): ${errorText}`);
    }

    const payload = await response.json();
    if (payload.errors) {
      throw new Error(`LeetCode GraphQL error: ${JSON.stringify(payload.errors)}`);
    }

    const list = payload.data?.questionSubmissionList;
    if (!list) {
      throw new Error('LeetCode response missing questionSubmissionList.');
    }

    const pageSubmissions = Array.isArray(list.submissions) ? list.submissions : [];
    for (const submission of pageSubmissions) {
      if (!includeNonAccepted) {
        const statusDisplay = submission.statusDisplay || submission.status;
        if (!statusDisplay || String(statusDisplay).toLowerCase() !== 'accepted') {
          continue;
        }
      }
      submissions.push(submission);
      if (limit && submissions.length >= limit) {
        break;
      }
    }

    lastKey = list.lastKey;
    hasNext = Boolean(list.hasNext);

    if (!lastKey && hasNext === false) {
      break;
    }
  }

  return submissions;
}

function mapSubmissionToRow(slug, submission) {
  const runtimeMs = parseRuntimeMs(submission.runtime);
  if (runtimeMs === null) {
    return null;
  }
  let timestamp = Number(submission.timestamp);
  if (!Number.isFinite(timestamp)) {
    return null;
  }
  if (timestamp > 1_000_000_000_000) {
    timestamp = Math.floor(timestamp / 1000);
  }

  return {
    id: String(submission.id),
    challenge_id: slugToChallengeId(slug),
    avg_time: runtimeMs,
    timer_time: 0,
    date: new Date(timestamp * 1000).toISOString()
  };
}

async function backfillForSlug(slug, options, insertStatement, submissionsOverride) {
  const challengeId = slugToChallengeId(slug);
  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    console.warn(`Skipping ${slug} (challenge "${challengeId}" not found).`);
    return { fetched: 0, inserted: 0, skipped: 0 };
  }

  const fetchedSubmissions = submissionsOverride || (await fetchSubmissions(slug, options));
  let inserted = 0;
  let skipped = 0;

  for (const submission of fetchedSubmissions) {
    const row = mapSubmissionToRow(slug, submission);
    if (!row) {
      skipped += 1;
      continue;
    }
    if (options.dryRun) {
      inserted += 1;
      continue;
    }
    const result = insertStatement.run(
      row.id,
      row.challenge_id,
      row.avg_time,
      row.timer_time,
      row.date
    );
    if (result.changes > 0) {
      inserted += 1;
    }
  }

  return { fetched: fetchedSubmissions.length, inserted, skipped };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.slugsFile) {
    const fileSlugs = await loadSlugsFromFile(options.slugsFile);
    options.slugs.push(...fileSlugs);
  }

  const uniqueSlugs = Array.from(new Set(options.slugs.filter(Boolean)));
  if (uniqueSlugs.length === 0) {
    console.error('No slugs provided. Use --slugs "two-sum,valid-parentheses" or --slugs-file path.');
    process.exit(1);
  }

  let submissionsFromFile = null;
  if (options.submissionsFile) {
    if (uniqueSlugs.length > 1) {
      console.error('Submissions file supports a single slug unless it is keyed by slug.');
      process.exit(1);
    }
    submissionsFromFile = await loadSubmissionsFromFile(options.submissionsFile, uniqueSlugs[0]);
  }

  initDatabase();
  const db = getDatabase();
  const insertStatement = db.prepare(`
    INSERT INTO submissions (id, challenge_id, avg_time, timer_time, date, created_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO NOTHING
  `);

  let totalInserted = 0;
  let totalFetched = 0;
  let totalSkipped = 0;

  try {
    for (const slug of uniqueSlugs) {
      const submissionsOverride = submissionsFromFile && slug === uniqueSlugs[0] ? submissionsFromFile : null;
      const result = await backfillForSlug(slug, options, insertStatement, submissionsOverride);
      totalFetched += result.fetched;
      totalInserted += result.inserted;
      totalSkipped += result.skipped;
      console.log(
        `Backfill ${slug}: fetched ${result.fetched}, inserted ${result.inserted}, skipped ${result.skipped}.`
      );
    }
  } finally {
    closeDatabase();
  }

  console.log(
    `Done. Total fetched: ${totalFetched}, inserted: ${totalInserted}, skipped: ${totalSkipped}.`
  );
}

if (process.argv[1] && process.argv[1].includes('backfillLeetCodeSubmissions.js')) {
  main().catch(error => {
    console.error('Backfill failed:', error.message);
    process.exit(1);
  });
}
