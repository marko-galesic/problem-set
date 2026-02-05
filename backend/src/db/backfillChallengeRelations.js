import { initDatabase, closeDatabase, getDatabase } from './database.js';

const DEFAULT_MAX_PREREQS = 2;
const GENERIC_TOPICS = new Set(['general', 'implementation', 'simulation']);
const DIFFICULTY_RANK = {
  easy: 0,
  medium: 1,
  hard: 2
};

function parseArgs(argv) {
  const options = {
    dryRun: false,
    force: false,
    limit: null,
    maxPrereqs: DEFAULT_MAX_PREREQS
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--force') {
      options.force = true;
      continue;
    }
    if (arg === '--limit' && argv[i + 1]) {
      const parsed = Number(argv[i + 1]);
      if (!Number.isNaN(parsed)) {
        options.limit = Math.max(1, parsed);
      }
      i += 1;
      continue;
    }
    if (arg === '--max-prereqs' && argv[i + 1]) {
      const parsed = Number(argv[i + 1]);
      if (!Number.isNaN(parsed)) {
        options.maxPrereqs = Math.max(0, Math.floor(parsed));
      }
      i += 1;
      continue;
    }
  }

  return options;
}

function parseTopics(rawTopics) {
  if (Array.isArray(rawTopics)) {
    return rawTopics;
  }
  if (typeof rawTopics === 'string' && rawTopics.trim()) {
    try {
      const parsed = JSON.parse(rawTopics);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeTopics(topics) {
  const normalized = [];
  for (const topic of topics || []) {
    if (typeof topic !== 'string') {
      continue;
    }
    const trimmed = topic.trim();
    if (!trimmed) {
      continue;
    }
    normalized.push(trimmed.toLowerCase());
  }
  return normalized;
}

function pickPrimaryTopic(topics) {
  for (const topic of topics) {
    if (!GENERIC_TOPICS.has(topic)) {
      return topic;
    }
  }
  return topics[0] || 'misc';
}

function difficultyRank(value) {
  if (!value || typeof value !== 'string') {
    return DIFFICULTY_RANK.medium;
  }
  const normalized = value.trim().toLowerCase();
  return DIFFICULTY_RANK[normalized] ?? DIFFICULTY_RANK.medium;
}

function buildRelations(challenges, maxPrereqs) {
  const groups = new Map();

  for (const challenge of challenges) {
    const topics = normalizeTopics(parseTopics(challenge.topics));
    const primaryTopic = pickPrimaryTopic(topics);
    const entry = {
      id: challenge.id,
      difficultyRank: difficultyRank(challenge.difficulty),
      primaryTopic
    };

    if (!groups.has(primaryTopic)) {
      groups.set(primaryTopic, []);
    }
    groups.get(primaryTopic).push(entry);
  }

  const treeRows = [];
  const prereqRows = [];

  const sortedTopics = Array.from(groups.keys()).sort();
  for (const topic of sortedTopics) {
    const group = groups.get(topic);
    group.sort((a, b) => {
      if (a.difficultyRank !== b.difficultyRank) {
        return a.difficultyRank - b.difficultyRank;
      }
      return a.id.localeCompare(b.id);
    });

    for (let i = 0; i < group.length; i += 1) {
      const current = group[i];
      const parentId = i > 0 ? group[i - 1].id : null;
      treeRows.push({
        challengeId: current.id,
        parentId,
        displayOrder: i
      });

      const prereqCount = Math.min(maxPrereqs, i);
      for (let offset = 1; offset <= prereqCount; offset += 1) {
        prereqRows.push({
          challengeId: current.id,
          prerequisiteId: group[i - offset].id
        });
      }
    }
  }

  return { treeRows, prereqRows, groupCount: groups.size };
}

function backfillChallengeRelations() {
  const options = parseArgs(process.argv.slice(2));

  initDatabase();
  const db = getDatabase();

  try {
    const query = options.limit
      ? 'SELECT id, difficulty, topics FROM challenges ORDER BY id LIMIT ?'
      : 'SELECT id, difficulty, topics FROM challenges ORDER BY id';
    const challenges = options.limit
      ? db.prepare(query).all(options.limit)
      : db.prepare(query).all();

    if (challenges.length === 0) {
      console.log('No challenges found; skipping relation backfill.');
      return;
    }

    const { treeRows, prereqRows, groupCount } = buildRelations(
      challenges,
      options.maxPrereqs
    );

    if (options.dryRun) {
      console.log('Dry run: no database changes will be made.');
      console.log(`Challenges processed: ${challenges.length}`);
      console.log(`Topic groups: ${groupCount}`);
      console.log(`Tree rows: ${treeRows.length}`);
      console.log(`Prerequisite rows: ${prereqRows.length}`);
      console.log('Sample tree rows:', treeRows.slice(0, 5));
      console.log('Sample prerequisite rows:', prereqRows.slice(0, 5));
      return;
    }

    const insertTreeSql = options.force
      ? 'INSERT INTO challenge_tree (challenge_id, parent_id, display_order) VALUES (?, ?, ?)'
      : 'INSERT OR IGNORE INTO challenge_tree (challenge_id, parent_id, display_order) VALUES (?, ?, ?)';
    const insertPrereqSql = options.force
      ? 'INSERT INTO challenge_prerequisites (challenge_id, prerequisite_id) VALUES (?, ?)'
      : 'INSERT OR IGNORE INTO challenge_prerequisites (challenge_id, prerequisite_id) VALUES (?, ?)';

    const insertTreeStmt = db.prepare(insertTreeSql);
    const insertPrereqStmt = db.prepare(insertPrereqSql);

    const transaction = db.transaction(() => {
      if (options.force) {
        db.prepare('DELETE FROM challenge_prerequisites').run();
        db.prepare('DELETE FROM challenge_tree').run();
      }

      for (const row of treeRows) {
        insertTreeStmt.run(row.challengeId, row.parentId, row.displayOrder);
      }
      for (const row of prereqRows) {
        insertPrereqStmt.run(row.challengeId, row.prerequisiteId);
      }
    });

    transaction();

    console.log(`Backfill complete.`);
    console.log(`Challenges processed: ${challenges.length}`);
    console.log(`Topic groups: ${groupCount}`);
    console.log(`Tree rows inserted: ${treeRows.length}`);
    console.log(`Prerequisite rows inserted: ${prereqRows.length}`);
  } finally {
    closeDatabase();
  }
}

if (process.argv[1] && process.argv[1].includes('backfillChallengeRelations.js')) {
  backfillChallengeRelations();
}
