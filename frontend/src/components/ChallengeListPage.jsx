import React, { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 12;
const FALLBACK_DIFFICULTY = 'Not set';
const MAX_SUBMISSIONS_PAGES = 50;
const SUBMISSIONS_PAGE_SIZE = 200;

function normalizeDifficulty(value) {
  if (!value) {
    return null;
  }
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'easy' || normalized === 'medium' || normalized === 'hard') {
    return normalized;
  }
  return null;
}

function formatDifficulty(value) {
  if (!value) {
    return FALLBACK_DIFFICULTY;
  }
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function normalizeTopics(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((topic) => String(topic));
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).map((topic) => String(topic));
      }
    } catch (error) {
      return [];
    }
  }
  return [];
}

async function fetchChallengesMetadata() {
  try {
    const response = await fetch('/api/challenges/metadata');
    if (!response.ok) {
      throw new Error('Failed to load challenges metadata');
    }
    const data = await response.json();
    const challenges = data.challenges || [];
    return challenges.map((challenge) => ({
      id: challenge.id,
      name: challenge.name,
      difficulty: challenge.difficulty,
      topics: challenge.topics ?? []
    }));
  } catch (error) {
    const fallbackResponse = await fetch('/api/challenges');
    if (!fallbackResponse.ok) {
      throw error;
    }
    const fallbackData = await fallbackResponse.json();
    const fallback = fallbackData.challenges || [];
    return fallback.map((challenge) => ({
      id: challenge.id,
      name: challenge.name,
      difficulty: null,
      topics: []
    }));
  }
}

async function fetchAllSubmissions() {
  const submissions = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= MAX_SUBMISSIONS_PAGES) {
    const response = await fetch(`/api/submissions?scope=all&limit=${SUBMISSIONS_PAGE_SIZE}&page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to load submissions');
    }
    const data = await response.json();
    submissions.push(...(data.submissions || []));
    hasMore = Boolean(data.hasMore);
    page += 1;
  }

  return submissions;
}

function buildDifficultyOptions(challenges) {
  const order = ['easy', 'medium', 'hard'];
  const found = new Set();
  challenges.forEach((challenge) => {
    const normalized = normalizeDifficulty(challenge.difficulty);
    if (normalized) {
      found.add(normalized);
    }
  });
  return order.filter((level) => found.has(level));
}

function buildTopicOptions(challenges) {
  const topicMap = new Map();
  challenges.forEach((challenge) => {
    const topics = normalizeTopics(challenge.topics);
    topics.forEach((topic) => {
      const key = topic.trim().toLowerCase();
      if (!key) {
        return;
      }
      if (!topicMap.has(key)) {
        topicMap.set(key, topic);
      }
    });
  });
  return Array.from(topicMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([value, label]) => ({ value, label }));
}

function getCompletionSet(submissions) {
  const completed = new Set();
  (submissions || []).forEach((submission) => {
    if (!submission) {
      return;
    }
    const challengeId = submission.challenge || submission.challengeId;
    if (typeof challengeId === 'string' && challengeId.trim()) {
      completed.add(challengeId.trim());
    }
  });
  return completed;
}

function CompletionIcon() {
  return (
    <svg
      className="challenge-card-check"
      viewBox="0 0 20 20"
      width="20"
      height="20"
      role="img"
      aria-hidden="true"
    >
      <path
        d="M7.8 14.1a1 1 0 0 1-.7-.3L4 10.7a1 1 0 0 1 1.4-1.4l2.4 2.4 6.8-6.8a1 1 0 1 1 1.4 1.4l-7.5 7.5a1 1 0 0 1-.7.3z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ChallengeListPage() {
  const [challenges, setChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState(new Set());
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completionError, setCompletionError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      setCompletionError(null);

      const [challengeResult, submissionsResult] = await Promise.allSettled([
        fetchChallengesMetadata(),
        fetchAllSubmissions()
      ]);

      if (!isMounted) {
        return;
      }

      if (challengeResult.status === 'fulfilled') {
        setChallenges(challengeResult.value);
      } else {
        setError(challengeResult.reason?.message || 'Failed to load challenges.');
      }

      if (submissionsResult.status === 'fulfilled') {
        setCompletedChallenges(getCompletionSet(submissionsResult.value));
      } else {
        setCompletionError('Completion status unavailable.');
      }

      setIsLoading(false);
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [difficultyFilter, topicFilter]);

  const difficultyOptions = useMemo(() => buildDifficultyOptions(challenges), [challenges]);
  const topicOptions = useMemo(() => buildTopicOptions(challenges), [challenges]);

  const filteredChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      const normalizedDifficulty = normalizeDifficulty(challenge.difficulty);
      const normalizedTopics = normalizeTopics(challenge.topics);

      if (difficultyFilter !== 'all' && normalizedDifficulty !== difficultyFilter) {
        return false;
      }

      if (topicFilter !== 'all') {
        const normalizedTopic = topicFilter.toLowerCase();
        const hasTopic = normalizedTopics.some((topic) => topic.trim().toLowerCase() === normalizedTopic);
        if (!hasTopic) {
          return false;
        }
      }

      return true;
    });
  }, [challenges, difficultyFilter, topicFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredChallenges.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (safePage !== currentPage) {
      setCurrentPage(safePage);
    }
  }, [safePage, currentPage]);

  const pageStart = filteredChallenges.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(filteredChallenges.length, safePage * PAGE_SIZE);
  const pagedChallenges = filteredChallenges.slice(pageStart - 1, pageEnd);

  return (
    <div className="challenge-list-page">
      <header className="challenge-list-header">
        <div>
          <h1 className="challenge-list-title">Challenges</h1>
          <p className="challenge-list-subtitle">Browse by difficulty or focus area, then jump into a problem.</p>
        </div>
        <a className="challenge-list-link" href="/" title="Back to the workspace">
          Back to Workspace
        </a>
      </header>

      <section className="challenge-list-controls">
        <div className="challenge-list-filters">
          <div className="challenge-list-filter">
            <label htmlFor="difficulty-filter">Difficulty</label>
            <select
              id="difficulty-filter"
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value)}
            >
              <option value="all">All</option>
              {difficultyOptions.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {formatDifficulty(difficulty)}
                </option>
              ))}
            </select>
          </div>
          <div className="challenge-list-filter">
            <label htmlFor="topic-filter">Topic</label>
            <select
              id="topic-filter"
              value={topicFilter}
              onChange={(event) => setTopicFilter(event.target.value)}
              disabled={topicOptions.length === 0}
            >
              <option value="all">All</option>
              {topicOptions.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="challenge-list-meta">
          <span>{filteredChallenges.length} challenge{filteredChallenges.length === 1 ? '' : 's'}</span>
          {completionError ? <span className="challenge-list-warning">{completionError}</span> : null}
        </div>
      </section>

      <section className="challenge-list-content">
        {isLoading ? (
          <div className="challenge-list-status">Loading challenges...</div>
        ) : error ? (
          <div className="challenge-list-error">{error}</div>
        ) : filteredChallenges.length === 0 ? (
          <div className="challenge-list-empty">No challenges match these filters.</div>
        ) : (
          <>
            <div className="challenge-list-grid">
              {pagedChallenges.map((challenge) => {
                const normalizedDifficulty = normalizeDifficulty(challenge.difficulty);
                const difficultyLabel = formatDifficulty(normalizedDifficulty || challenge.difficulty);
                const topics = normalizeTopics(challenge.topics);
                const isCompleted = completedChallenges.has(challenge.id);

                return (
                  <div key={challenge.id} className="challenge-card">
                    <div className="challenge-card-header">
                      <div className="challenge-card-title-row">
                        <div className="challenge-card-title">
                          <span className="challenge-card-name">{challenge.name}</span>
                          {isCompleted ? (
                            <span className="challenge-card-status" title="Completed" aria-label="Completed">
                              <CompletionIcon />
                            </span>
                          ) : (
                            <span className="challenge-card-status-placeholder" aria-hidden="true" />
                          )}
                        </div>
                        <span className={`challenge-card-pill difficulty-${normalizedDifficulty || 'unknown'}`}>
                          {difficultyLabel}
                        </span>
                      </div>
                      <div className="challenge-card-subtitle">ID: {challenge.id}</div>
                    </div>
                    <div className="challenge-card-topics">
                      {topics.length > 0 ? (
                        topics.map((topic) => (
                          <span key={`${challenge.id}-${topic}`} className="challenge-card-topic">
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="challenge-card-topic muted">No topics</span>
                      )}
                    </div>
                    <a
                      className="challenge-card-link"
                      href={`/?challenge=${challenge.id}`}
                      title={`Open ${challenge.name}`}
                    >
                      Open Challenge
                    </a>
                  </div>
                );
              })}
            </div>

            <div className="challenge-list-pagination">
              <div className="challenge-list-pagination-meta">
                Showing {pageStart}-{pageEnd} of {filteredChallenges.length}
              </div>
              <div className="challenge-list-pagination-controls">
                <button
                  type="button"
                  className="btn btn--sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage <= 1}
                >
                  Prev
                </button>
                <div className="challenge-list-pagination-pages">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={`page-${page}`}
                        type="button"
                        className={`challenge-page-button${page === safePage ? ' is-active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                        aria-current={page === safePage ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="btn btn--sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={safePage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
