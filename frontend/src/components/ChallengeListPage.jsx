import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api/client';

const PAGE_SIZE = 25;
const FALLBACK_DIFFICULTY = 'Not set';
const MAX_SEARCH_SUGGESTIONS = 5;
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

function normalizeSearchValue(value) {
  if (!value) {
    return '';
  }
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSearchText(challenge) {
  if (!challenge) {
    return '';
  }
  return [challenge.name, challenge.id].filter(Boolean).join(' ');
}

function getLevenshteinDistance(source, target) {
  if (source === target) {
    return 0;
  }
  if (!source) {
    return target.length;
  }
  if (!target) {
    return source.length;
  }

  const sourceLength = source.length;
  const targetLength = target.length;
  const previous = new Array(targetLength + 1);
  const current = new Array(targetLength + 1);

  for (let index = 0; index <= targetLength; index += 1) {
    previous[index] = index;
  }

  for (let row = 1; row <= sourceLength; row += 1) {
    current[0] = row;
    const sourceChar = source.charAt(row - 1);
    for (let column = 1; column <= targetLength; column += 1) {
      const targetChar = target.charAt(column - 1);
      const cost = sourceChar === targetChar ? 0 : 1;
      current[column] = Math.min(
        previous[column] + 1,
        current[column - 1] + 1,
        previous[column - 1] + cost
      );
    }

    for (let column = 0; column <= targetLength; column += 1) {
      previous[column] = current[column];
    }
  }

  return previous[targetLength];
}

function getSearchScore(challenge, query) {
  if (!query) {
    return Number.POSITIVE_INFINITY;
  }
  const target = normalizeSearchValue(getSearchText(challenge));
  if (!target) {
    return Number.POSITIVE_INFINITY;
  }
  if (target === query) {
    return 0;
  }

  const index = target.indexOf(query);
  if (index === 0) {
    return 0.25;
  }
  if (index > 0) {
    return 1 + index / Math.max(1, target.length);
  }

  const distance = getLevenshteinDistance(target, query);
  return 2 + distance / Math.max(target.length, query.length, 1);
}

function buildSearchSuggestions(challenges, query) {
  if (!query) {
    return [];
  }
  return (challenges || [])
    .map((challenge) => ({
      challenge,
      score: getSearchScore(challenge, query)
    }))
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => {
      if (a.score !== b.score) {
        return a.score - b.score;
      }
      return String(a.challenge?.name || '').localeCompare(String(b.challenge?.name || ''));
    })
    .slice(0, MAX_SEARCH_SUGGESTIONS)
    .map((item) => item.challenge);
}

function matchesSearch(challenge, query) {
  if (!query) {
    return true;
  }
  const target = normalizeSearchValue(getSearchText(challenge));
  if (!target) {
    return false;
  }
  const tokens = query.split(' ').filter(Boolean);
  return tokens.every((token) => target.includes(token));
}

async function fetchChallengesMetadata() {
  try {
    const response = await apiFetch('/api/challenges/metadata');
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
    const fallbackResponse = await apiFetch('/api/challenges');
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
    const response = await apiFetch(`/api/submissions?scope=all&limit=${SUBMISSIONS_PAGE_SIZE}&page=${page}`);
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
      className="challenge-row-check"
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
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
  }, [difficultyFilter, topicFilter, searchQuery]);

  const normalizedSearch = useMemo(() => normalizeSearchValue(searchQuery), [searchQuery]);

  useEffect(() => {
    if (!normalizedSearch) {
      setActiveSuggestionIndex(-1);
      setIsSearchOpen(false);
    }
  }, [normalizedSearch]);

  const difficultyOptions = useMemo(() => buildDifficultyOptions(challenges), [challenges]);
  const topicOptions = useMemo(() => buildTopicOptions(challenges), [challenges]);

  const searchBaseChallenges = useMemo(() => {
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

  const filteredChallenges = useMemo(() => {
    if (!normalizedSearch) {
      return searchBaseChallenges;
    }
    return searchBaseChallenges.filter((challenge) => matchesSearch(challenge, normalizedSearch));
  }, [searchBaseChallenges, normalizedSearch]);

  const searchSuggestions = useMemo(() => {
    if (!normalizedSearch) {
      return [];
    }
    return buildSearchSuggestions(searchBaseChallenges, normalizedSearch);
  }, [searchBaseChallenges, normalizedSearch]);

  const showSuggestions = isSearchOpen && normalizedSearch.length > 0;
  const activeSuggestion =
    activeSuggestionIndex >= 0 ? searchSuggestions[activeSuggestionIndex] : null;

  function handleSearchChange(event) {
    setSearchQuery(event.target.value);
    setIsSearchOpen(true);
  }

  function handleSearchKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsSearchOpen(true);
      if (searchSuggestions.length === 0) {
        return;
      }
      setActiveSuggestionIndex((prev) =>
        prev < searchSuggestions.length - 1 ? prev + 1 : 0
      );
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsSearchOpen(true);
      if (searchSuggestions.length === 0) {
        return;
      }
      setActiveSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : searchSuggestions.length - 1
      );
      return;
    }
    if (event.key === 'Enter' && activeSuggestion) {
      event.preventDefault();
      setSearchQuery(activeSuggestion.name || '');
      setIsSearchOpen(false);
      setActiveSuggestionIndex(-1);
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsSearchOpen(false);
      setActiveSuggestionIndex(-1);
    }
  }

  function handleSuggestionSelect(challenge) {
    if (!challenge) {
      return;
    }
    setSearchQuery(challenge.name || '');
    setIsSearchOpen(false);
    setActiveSuggestionIndex(-1);
  }

  function handleSearchBlur(event) {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    setIsSearchOpen(false);
    setActiveSuggestionIndex(-1);
  }

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
          <div
            className="challenge-list-filter challenge-search"
            onBlur={handleSearchBlur}
            onFocus={() => setIsSearchOpen(true)}
          >
            <label htmlFor="challenge-search">Search</label>
            <input
              id="challenge-search"
              type="text"
              className="challenge-search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search challenges..."
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
              aria-controls="challenge-search-listbox"
              aria-activedescendant={
                activeSuggestion
                  ? `challenge-search-option-${activeSuggestion.id || activeSuggestionIndex}`
                  : undefined
              }
            />
            {showSuggestions ? (
              <div className="challenge-search-dropdown" role="listbox" id="challenge-search-listbox">
                {searchSuggestions.length > 0 ? (
                  searchSuggestions.map((challenge, index) => {
                    const normalizedDifficulty = normalizeDifficulty(challenge.difficulty);
                    const difficultyLabel = normalizedDifficulty
                      ? formatDifficulty(normalizedDifficulty)
                      : null;
                    const meta = [challenge.id, difficultyLabel].filter(Boolean).join(' · ');
                    const isActive = index === activeSuggestionIndex;
                    return (
                      <button
                        key={challenge.id || `${challenge.name}-${index}`}
                        type="button"
                        className={`challenge-search-option${isActive ? ' is-active' : ''}`}
                        onClick={() => handleSuggestionSelect(challenge)}
                        role="option"
                        aria-selected={isActive}
                        id={`challenge-search-option-${challenge.id || index}`}
                      >
                        <span className="challenge-search-option-name">{challenge.name}</span>
                        {meta ? <span className="challenge-search-option-meta">{meta}</span> : null}
                      </button>
                    );
                  })
                ) : (
                  <div className="challenge-search-empty">No close matches yet.</div>
                )}
              </div>
            ) : null}
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
            <ol className="challenge-list-items">
              {pagedChallenges.map((challenge) => {
                const normalizedDifficulty = normalizeDifficulty(challenge.difficulty);
                const difficultyLabel = formatDifficulty(normalizedDifficulty || challenge.difficulty);
                const topics = normalizeTopics(challenge.topics);
                const isCompleted = completedChallenges.has(challenge.id);
                const topicLabel = topics.length > 0 ? topics.join(', ') : 'No topics';

                return (
                  <li key={challenge.id} className="challenge-row">
                    <div className="challenge-row-name">
                      <a
                        className="challenge-row-link"
                        href={`/?challenge=${challenge.id}`}
                        title={`Open ${challenge.name}`}
                      >
                        {challenge.name}
                      </a>
                      {isCompleted ? (
                        <span className="challenge-row-status" title="Completed" aria-label="Completed">
                          <CompletionIcon />
                        </span>
                      ) : (
                        <span className="challenge-row-status-placeholder" aria-hidden="true" />
                      )}
                    </div>
                    <div className="challenge-row-topics">{topicLabel}</div>
                    <div className={`challenge-row-difficulty difficulty-${normalizedDifficulty || 'unknown'}`}>
                      {difficultyLabel}
                    </div>
                  </li>
                );
              })}
            </ol>

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
