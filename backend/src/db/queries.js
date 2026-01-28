import { getDatabase } from './database.js';

/**
 * Challenge queries
 */

export function getChallengeById(challengeId) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM challenges WHERE id = ?');
  return stmt.get(challengeId);
}

export function getAllChallenges() {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM challenges ORDER BY name');
  return stmt.all();
}

export function insertChallenge(challenge) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO challenges (id, name, folder, test_file, adapter, difficulty, topics, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      folder = excluded.folder,
      test_file = excluded.test_file,
      adapter = excluded.adapter,
      difficulty = excluded.difficulty,
      topics = excluded.topics,
      updated_at = CURRENT_TIMESTAMP
  `);
  
  const topicsJson = Array.isArray(challenge.topics) 
    ? JSON.stringify(challenge.topics) 
    : challenge.topics || '[]';
  
  return stmt.run(
    challenge.id,
    challenge.name,
    challenge.folder,
    challenge.test_file,
    challenge.adapter,
    challenge.difficulty ?? null,
    topicsJson
  );
}

export function updateChallengeMetadata(challengeId, metadata) {
  const db = getDatabase();
  const updates = [];
  const values = [];
  
  if (metadata.name !== undefined) {
    updates.push('name = ?');
    values.push(metadata.name);
  }
  if (metadata.difficulty !== undefined) {
    updates.push('difficulty = ?');
    values.push(metadata.difficulty);
  }
  if (metadata.topics !== undefined) {
    updates.push('topics = ?');
    values.push(Array.isArray(metadata.topics) 
      ? JSON.stringify(metadata.topics) 
      : metadata.topics);
  }
  
  if (updates.length === 0) {
    return { changes: 0 };
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(challengeId);
  
  const stmt = db.prepare(`
    UPDATE challenges 
    SET ${updates.join(', ')} 
    WHERE id = ?
  `);
  
  return stmt.run(...values);
}

/**
 * Prerequisites queries
 */

export function getPrerequisites(challengeId) {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT c.* 
    FROM challenges c
    INNER JOIN challenge_prerequisites cp ON c.id = cp.prerequisite_id
    WHERE cp.challenge_id = ?
  `);
  return stmt.all(challengeId);
}

export function setPrerequisites(challengeId, prerequisiteIds) {
  const db = getDatabase();
  const transaction = db.transaction((challengeId, prereqIds) => {
    // Delete existing prerequisites
    const deleteStmt = db.prepare('DELETE FROM challenge_prerequisites WHERE challenge_id = ?');
    deleteStmt.run(challengeId);
    
    // Insert new prerequisites
    const insertStmt = db.prepare(`
      INSERT INTO challenge_prerequisites (challenge_id, prerequisite_id)
      VALUES (?, ?)
    `);
    
    for (const prereqId of prereqIds) {
      insertStmt.run(challengeId, prereqId);
    }
  });
  
  return transaction(challengeId, prerequisiteIds);
}

/**
 * Skill tree queries
 */

export function getChallengeTree() {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT 
      c.*,
      ct.parent_id,
      ct.display_order
    FROM challenges c
    LEFT JOIN challenge_tree ct ON c.id = ct.challenge_id
    ORDER BY ct.parent_id NULLS FIRST, ct.display_order, c.name
  `);
  return stmt.all();
}

export function setChallengeParent(challengeId, parentId, displayOrder = 0) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO challenge_tree (challenge_id, parent_id, display_order)
    VALUES (?, ?, ?)
    ON CONFLICT(challenge_id) DO UPDATE SET
      parent_id = excluded.parent_id,
      display_order = excluded.display_order
  `);
  return stmt.run(challengeId, parentId, displayOrder);
}

/**
 * Company tier queries
 */

export function getCompanyTiers(challengeId) {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT tier, required 
    FROM challenge_company_tiers 
    WHERE challenge_id = ?
  `);
  return stmt.all(challengeId);
}

export function setCompanyTiers(challengeId, tiers) {
  const db = getDatabase();
  const transaction = db.transaction((challengeId, tiers) => {
    // Delete existing tiers
    const deleteStmt = db.prepare('DELETE FROM challenge_company_tiers WHERE challenge_id = ?');
    deleteStmt.run(challengeId);
    
    // Insert new tiers
    const insertStmt = db.prepare(`
      INSERT INTO challenge_company_tiers (challenge_id, tier, required)
      VALUES (?, ?, ?)
    `);
    
    for (const { tier, required } of tiers) {
      insertStmt.run(challengeId, tier, required ? 1 : 0);
    }
  });
  
  return transaction(challengeId, tiers);
}

/**
 * Submission queries
 */

export function getSubmissions(challengeId, limit = null) {
  const db = getDatabase();
  if (limit) {
    const stmt = db.prepare(`
      SELECT * FROM submissions 
      WHERE challenge_id = ? 
      ORDER BY date DESC 
      LIMIT ?
    `);
    return stmt.all(challengeId, limit);
  } else {
    const stmt = db.prepare(`
      SELECT * FROM submissions 
      WHERE challenge_id = ? 
      ORDER BY date DESC
    `);
    return stmt.all(challengeId);
  }
}

export function getAllSubmissions() {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT 
      id,
      challenge_id,
      avg_time,
      timer_time,
      date,
      tech_bar_status,
      tech_bar_label,
      submit_attempts,
      guidance_level,
      language
    FROM submissions
    ORDER BY date DESC
  `);
  return stmt.all();
}

export function getSubmissionsPage({ limit = 50, offset = 0, language = null, from = null, to = null } = {}) {
  const db = getDatabase();
  const conditions = [];
  const params = [];

  if (language) {
    conditions.push('LOWER(language) = ?');
    params.push(language.toLowerCase());
  }
  if (from) {
    conditions.push('date >= ?');
    params.push(from);
  }
  if (to) {
    conditions.push('date <= ?');
    params.push(to);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const stmt = db.prepare(`
    SELECT 
      id,
      challenge_id,
      avg_time,
      timer_time,
      date,
      tech_bar_status,
      tech_bar_label,
      submit_attempts,
      guidance_level,
      language
    FROM submissions
    ${whereClause}
    ORDER BY date DESC
    LIMIT ?
    OFFSET ?
  `);
  return stmt.all(...params, limit, offset);
}

export function getSubmissionsCount({ language = null, from = null, to = null } = {}) {
  const db = getDatabase();
  const conditions = [];
  const params = [];

  if (language) {
    conditions.push('LOWER(language) = ?');
    params.push(language.toLowerCase());
  }
  if (from) {
    conditions.push('date >= ?');
    params.push(from);
  }
  if (to) {
    conditions.push('date <= ?');
    params.push(to);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const stmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM submissions
    ${whereClause}
  `);
  const row = stmt.get(...params);
  return row?.count ?? 0;
}

export function getSubmissionById(submissionId) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM submissions WHERE id = ?');
  return stmt.get(submissionId);
}

export function insertSubmission(submission) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO submissions (
      id,
      challenge_id,
      avg_time,
      timer_time,
      date,
      solution,
      submit_attempts,
      tech_bar_status,
      tech_bar_label,
      guidance_level,
      language,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  
  return stmt.run(
    submission.id,
    submission.challenge_id,
    submission.avg_time,
    submission.timer_time,
    submission.date,
    submission.solution ?? null,
    submission.submit_attempts ?? null,
    submission.tech_bar_status ?? 'pending',
    submission.tech_bar_label ?? null,
    submission.guidance_level ?? 'Independent',
    submission.language ?? 'java'
  );
}

export function deleteSubmission(submissionId) {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM submissions WHERE id = ?');
  return stmt.run(submissionId);
}

export function updateSubmission(submissionId, timerTime) {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE submissions SET timer_time = ? WHERE id = ?');
  return stmt.run(timerTime, submissionId);
}

export function updateSubmissionTechBar(submissionId, status, label) {
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE submissions
    SET tech_bar_status = ?, tech_bar_label = ?
    WHERE id = ?
  `);
  return stmt.run(status, label, submissionId);
}

/**
 * Language preference queries
 */

export function getLanguagePreference(challengeId) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT language FROM language_preferences WHERE challenge_id = ?');
  return stmt.get(challengeId);
}

export function getLatestLanguagePreference(excludeChallengeId) {
  const db = getDatabase();
  if (excludeChallengeId) {
    const stmt = db.prepare(`
      SELECT language FROM language_preferences
      WHERE challenge_id != ?
      ORDER BY updated_at DESC
      LIMIT 1
    `);
    return stmt.get(excludeChallengeId);
  }
  const stmt = db.prepare(`
    SELECT language FROM language_preferences
    ORDER BY updated_at DESC
    LIMIT 1
  `);
  return stmt.get();
}

export function setLanguagePreference(challengeId, language) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO language_preferences (challenge_id, language, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(challenge_id) DO UPDATE SET
      language = excluded.language,
      updated_at = CURRENT_TIMESTAMP
  `);
  return stmt.run(challengeId, language);
}


/**
 * Analytics queries
 */

export function getChallengeStats(challengeId) {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT 
      COUNT(*) as total_submissions,
      AVG(avg_time) as avg_execution_time,
      AVG(timer_time) as avg_timer_time,
      MIN(avg_time) as best_time,
      MAX(date) as last_submission_date
    FROM submissions
    WHERE challenge_id = ?
  `);
  return stmt.get(challengeId);
}

export function getTopicStats() {
  const db = getDatabase();
  // This is a complex query that would need to parse JSON topics
  // For now, return basic structure
  const stmt = db.prepare(`
    SELECT 
      c.id,
      c.name,
      c.topics,
      COUNT(s.id) as submission_count,
      AVG(s.avg_time) as avg_time
    FROM challenges c
    LEFT JOIN submissions s ON c.id = s.challenge_id
    GROUP BY c.id
  `);
  return stmt.all();
}

/**
 * Fitness history queries
 */

export function insertFitnessSnapshot(snapshotAt, entries) {
  const db = getDatabase();
  const transaction = db.transaction((snapshotAt, entries) => {
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO fitness_history (
        snapshot_at,
        topic,
        difficulty,
        fitness,
        submission_count,
        last_submission,
        language
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const entry of entries) {
      insertStmt.run(
        snapshotAt,
        entry.topic,
        entry.difficulty,
        entry.fitness,
        entry.submissionCount,
        entry.lastSubmission ?? null,
        entry.language ?? 'java'
      );
    }
  });

  return transaction(snapshotAt, entries);
}

export function getFitnessHistory({ topic, difficulty, since, until, limit, language } = {}) {
  const db = getDatabase();
  const conditions = [];
  const values = [];

  if (topic) {
    conditions.push('topic = ?');
    values.push(topic);
  }

  if (difficulty) {
    conditions.push('difficulty = ?');
    values.push(difficulty);
  }

  if (language) {
    conditions.push('language = ?');
    values.push(language);
  }

  if (since) {
    conditions.push('snapshot_at >= ?');
    values.push(since);
  }

  if (until) {
    conditions.push('snapshot_at <= ?');
    values.push(until);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const limitClause = Number.isFinite(limit) && limit > 0 ? 'LIMIT ?' : '';

  if (limitClause) {
    values.push(limit);
  }

  const stmt = db.prepare(`
    SELECT
      snapshot_at,
      topic,
      difficulty,
      fitness,
      submission_count,
      last_submission,
      language
    FROM fitness_history
    ${whereClause}
    ORDER BY snapshot_at ASC
    ${limitClause}
  `);

  return stmt.all(...values);
}
