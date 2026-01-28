import React, { useState, useEffect } from 'react';
import RecommendationPromptPopover from './RecommendationPromptPopover';
import LanguageSwitchPopover from './LanguageSwitchPopover';
import TopicFitnessCriteriaPopover from './TopicFitnessCriteriaPopover';
import { getLanguagePreference, saveLanguagePreference } from '../utils/storage';

const UNKNOWN_DIFFICULTY = 'Not set';
const TECH_BAR_LEGEND = [
  {
    tier: 'Top tier',
    minutes: {
      Easy: 15,
      Medium: 25,
      Hard: 40
    }
  },
  {
    tier: 'Mid tier',
    minutes: {
      Easy: 20,
      Medium: 30,
      Hard: 45
    }
  }
];

const LANGUAGE_OPTIONS = [
  { id: 'java', label: 'Java' },
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' }
];

const FITNESS_GRADE_BANDS = [
  { min: 0.9, grade: 'A', status: 'exceeds', tone: 'a' },
  { min: 0.8, grade: 'B', status: 'met', tone: 'b' },
  { min: 0.7, grade: 'C', status: 'met', tone: 'c' },
  { min: 0.6, grade: 'D', status: 'not met', tone: 'd' },
  { min: 0, grade: 'E', status: 'not met', tone: 'e' }
];

const ACTIVITY_WINDOW_DAYS = 7;

function createLanguageMap(defaultValue) {
  return LANGUAGE_OPTIONS.reduce((acc, option) => {
    acc[option.id] = defaultValue;
    return acc;
  }, {});
}

function formatTime(ms) {
  if (ms === null || ms === undefined) {
    return 'N/A';
  }
  if (ms < 0) {
    return 'Untracked';
  }
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatDate(dateString) {
  if (!dateString) {
    return 'N/A';
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleString();
}

function formatAttempts(value) {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  return String(value);
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getStartOfLocalDay(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function buildRecentDayBuckets(days) {
  const today = getStartOfLocalDay(new Date());
  const buckets = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    buckets.push({
      date,
      key: getLocalDateKey(date),
      label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      count: 0
    });
  }
  return buckets;
}

function buildSubmissionTrend(submissions, days) {
  const buckets = buildRecentDayBuckets(days);
  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));
  (submissions || []).forEach((submission) => {
    const parsed = new Date(submission?.date);
    if (Number.isNaN(parsed.getTime())) {
      return;
    }
    const key = getLocalDateKey(parsed);
    const bucket = bucketMap.get(key);
    if (bucket) {
      bucket.count += 1;
    }
  });
  return buckets;
}

function buildCsvRow(values) {
  return values
    .map((value) => {
      const stringValue = value === null || value === undefined ? '' : String(value);
      const escapedValue = stringValue.replace(/"/g, '""');
      return `"${escapedValue}"`;
    })
    .join(',');
}

export default function SubmissionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [challengeMap, setChallengeMap] = useState({});
  const [challengeMetadata, setChallengeMetadata] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [topicFitness, setTopicFitness] = useState([]);
  const [topicFitnessLoading, setTopicFitnessLoading] = useState(false);
  const [topicFitnessError, setTopicFitnessError] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [recommendationLoading, setRecommendationLoading] = useState(createLanguageMap(false));
  const [recommendationError, setRecommendationError] = useState(createLanguageMap(null));
  const [recommendation, setRecommendation] = useState(createLanguageMap(null));
  const [recommendationExpanded, setRecommendationExpanded] = useState(false);
  const [recommendationEmpty, setRecommendationEmpty] = useState(createLanguageMap(false));
  const [isPromptPopoverOpen, setIsPromptPopoverOpen] = useState(false);
  const [languagePopoverInfo, setLanguagePopoverInfo] = useState(null);
  const [isCriteriaPopoverOpen, setIsCriteriaPopoverOpen] = useState(false);
  const [activeTopicTab, setActiveTopicTab] = useState('fitness');

  function getFitnessGrade(fitness) {
    const normalized = Math.max(0, Math.min(1, fitness));
    return (
      FITNESS_GRADE_BANDS.find((band) => normalized >= band.min) ||
      FITNESS_GRADE_BANDS[FITNESS_GRADE_BANDS.length - 1]
    );
  }

  function renderDifficultyCell(entry, level) {
    const data = entry?.[level] || {};
    const submissionCount = Number.isFinite(data.submissionCount) ? data.submissionCount : 0;
    const fitness = Number.isFinite(data.fitness) ? data.fitness : 0;
    const hasNoSignal = submissionCount <= 0 || fitness <= 0;

    if (hasNoSignal) {
      return (
        <div className="topic-fitness-cell is-empty">
          <div className="topic-fitness-empty">Fresh start</div>
        </div>
      );
    }

    const grade = getFitnessGrade(fitness);
    return (
      <div className="topic-fitness-cell">
        <div className="topic-fitness-score" aria-label={`${grade.grade} ${grade.status}`}>
          <span className={`topic-fitness-grade grade-${grade.tone}`}>{grade.grade}</span>
          <span className="topic-fitness-separator" aria-hidden="true">
            /
          </span>
          <span className="topic-fitness-status-label">{grade.status}</span>
        </div>
      </div>
    );
  }

  async function handleExportCsv() {
    const headers = [
      'Problem Title',
      'Difficulty',
      'Submitted',
      'Avg Runtime',
      'Timer Time',
      'Submit Attempts',
      'Guidance',
      'Tech Bar Label'
    ];

    setIsExporting(true);
    try {
      const exportSubmissions = await fetchAllSubmissions({ language: selectedLanguage });
      const rows = exportSubmissions.map((submission) => {
        const challenge = challengeMap[submission.challenge] || {};
        const title = challenge.name || submission.challenge || 'Unknown Challenge';
        const difficulty = challenge.difficulty ?? UNKNOWN_DIFFICULTY;
        return [
          title,
          difficulty,
          formatDate(submission.date),
          `${submission.avgTime ?? 'N/A'}ms`,
          formatTime(submission.timerTime),
          formatAttempts(submission.submitAttempts),
          submission.guidanceLevel ?? 'Independent',
          submission.techBarLabel ?? 'None'
        ];
      });

      const csvContent = [buildCsvRow(headers), ...rows.map(buildCsvRow)].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'submissions.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (exportError) {
      console.error('Failed to export submissions:', exportError);
    } finally {
      setIsExporting(false);
    }
  }

  function normalizeLanguage(value) {
    if (typeof value !== 'string') {
      return 'java';
    }
    const normalized = value.trim().toLowerCase();
    if (normalized === 'python') {
      return 'python';
    }
    if (normalized === 'javascript' || normalized === 'js') {
      return 'javascript';
    }
    if (normalized === 'typescript' || normalized === 'ts') {
      return 'typescript';
    }
    return 'java';
  }

  function getLanguageLabel(languageId) {
    return LANGUAGE_OPTIONS.find((option) => option.id === languageId)?.label || languageId;
  }

  async function fetchSubmissionPage({ page: requestPage = 1, limit = pageSize, language, from, to } = {}) {
    const params = new URLSearchParams({
      scope: 'all',
      page: String(requestPage),
      limit: String(limit)
    });
    if (language) {
      params.set('language', normalizeLanguage(language));
    }
    if (from) {
      params.set('from', from);
    }
    if (to) {
      params.set('to', to);
    }

    const response = await fetch(`/api/submissions?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to load submissions');
    }
    return response.json();
  }

  async function fetchAllSubmissions({ language, from, to } = {}) {
    const all = [];
    let requestPage = 1;
    let hasMorePages = true;
    const limit = 200;

    while (hasMorePages) {
      const data = await fetchSubmissionPage({
        page: requestPage,
        limit,
        language,
        from,
        to
      });
      const batch = Array.isArray(data.submissions) ? data.submissions : [];
      all.push(...batch);
      hasMorePages = Boolean(data.hasMore);
      requestPage += 1;
      if (requestPage > 2000) {
        hasMorePages = false;
      }
    }

    return all;
  }

  function getRecentDateRange(days) {
    const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return { from: fromDate.toISOString() };
  }

  function handleLanguageSwitch(nextLanguage, currentLanguage) {
    if (nextLanguage === currentLanguage) {
      return;
    }
    setPage(1);
    setLanguagePopoverInfo({
      from: getLanguageLabel(currentLanguage),
      to: getLanguageLabel(nextLanguage)
    });
    setSelectedLanguage(nextLanguage);
    void saveLanguagePreference(nextLanguage);
  }

  function handleTopicTabChange(nextTab) {
    if (nextTab === activeTopicTab) {
      return;
    }
    setActiveTopicTab(nextTab);
    if (nextTab !== 'fitness') {
      setIsCriteriaPopoverOpen(false);
    }
  }

  function buildFallbackRecommendation(language) {
    const label = LANGUAGE_OPTIONS.find(option => option.id === language)?.label || 'Java';
    return {
      name: 'Two Sum',
      difficulty: 'Easy',
      explanation: `No ${label} submissions yet. Start with Two Sum to build a baseline.`,
      systemPrompt: null,
      userPrompt: null
    };
  }

  async function fetchChallengesMetadata() {
    try {
      const response = await fetch('/api/challenges/metadata');
      if (!response.ok) {
        throw new Error('Failed to load challenge metadata');
      }
      const data = await response.json();
      const metadata = data.challenges || [];
      return metadata.map((challenge) => ({
        id: challenge.id,
        name: challenge.name,
        difficulty: challenge.difficulty
      }));
    } catch (metadataError) {
      const fallbackResponse = await fetch('/api/challenges');
      if (!fallbackResponse.ok) {
        throw new Error('Failed to load challenges');
      }
      const fallbackData = await fallbackResponse.json();
      const fallback = fallbackData.challenges || [];
      return fallback.map((challenge) => ({
        id: challenge.id,
        name: challenge.name,
        difficulty: UNKNOWN_DIFFICULTY
      }));
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadLanguagePreference() {
      const savedLanguage = await getLanguagePreference();
      if (!isMounted) {
        return;
      }
      const normalized = normalizeLanguage(savedLanguage || 'java');
      setSelectedLanguage(normalized);
    }

    loadLanguagePreference();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadChallenges() {
      try {
        const challenges = await fetchChallengesMetadata();
        const map = challenges.reduce((acc, challenge) => {
          acc[challenge.id] = challenge;
          return acc;
        }, {});
        if (isMounted) {
          setChallengeMap(map);
          setChallengeMetadata(challenges);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Failed to load challenges.');
        }
      }
    }

    loadChallenges();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSubmissionPage() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSubmissionPage({
          page,
          limit: pageSize,
          language: selectedLanguage
        });
        if (!isMounted) {
          return;
        }
        setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);
        setTotalSubmissions(Number.isFinite(data.total) ? data.total : 0);
        setHasMore(Boolean(data.hasMore));
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Failed to load submissions.');
          setSubmissions([]);
          setTotalSubmissions(0);
          setHasMore(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSubmissionPage();

    return () => {
      isMounted = false;
    };
  }, [page, pageSize, selectedLanguage]);

  useEffect(() => {
    if (activeTopicTab !== 'activity') {
      return undefined;
    }
    let isMounted = true;

    async function loadActivity() {
      setActivityLoading(true);
      setActivityError(null);
      try {
        const start = getStartOfLocalDay(new Date());
        start.setDate(start.getDate() - (ACTIVITY_WINDOW_DAYS - 1));
        const recentSubmissions = await fetchAllSubmissions({
          language: selectedLanguage,
          from: start.toISOString()
        });
        if (!isMounted) {
          return;
        }
        setActivityData(buildSubmissionTrend(recentSubmissions, ACTIVITY_WINDOW_DAYS));
      } catch (loadError) {
        if (isMounted) {
          setActivityError(loadError.message || 'Failed to load submission activity.');
          setActivityData(buildRecentDayBuckets(ACTIVITY_WINDOW_DAYS));
        }
      } finally {
        if (isMounted) {
          setActivityLoading(false);
        }
      }
    }

    loadActivity();

    return () => {
      isMounted = false;
    };
  }, [activeTopicTab, selectedLanguage]);

  useEffect(() => {
    let isMounted = true;

    async function loadRecommendations() {
      if (!challengeMetadata || challengeMetadata.length === 0) {
        return;
      }
      setRecommendationLoading(createLanguageMap(true));
      setRecommendationError(createLanguageMap(null));
      setRecommendation(createLanguageMap(null));
      setRecommendationExpanded(false);
      setRecommendationEmpty(createLanguageMap(false));
      setIsPromptPopoverOpen(false);

      try {
        const { from } = getRecentDateRange(14);

        const results = await Promise.allSettled(
          LANGUAGE_OPTIONS.map(async (option) => {
            const language = option.id;
            const summary = await fetchSubmissionPage({ page: 1, limit: 1, language });
            const total = Number.isFinite(summary.total) ? summary.total : 0;
            if (total <= 0) {
              return { empty: true, payload: buildFallbackRecommendation(language) };
            }

            const recentSubmissions = await fetchAllSubmissions({ language, from });
            const response = await fetch('/api/recommend-next-challenge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                submissions: recentSubmissions,
                challenges: challengeMetadata
              })
            });

            if (!response.ok) {
              throw new Error('Failed to load recommendation');
            }

            const data = await response.json();
            return {
              empty: false,
              payload: {
                name: data.name,
                difficulty: data.difficulty,
                explanation: data.explanation,
                systemPrompt: data.systemPrompt,
                userPrompt: data.userPrompt
              }
            };
          })
        );

        if (!isMounted) {
          return;
        }

        const nextRecommendation = createLanguageMap(null);
        const nextRecommendationError = createLanguageMap(null);
        const nextRecommendationLoading = createLanguageMap(false);
        const nextRecommendationEmpty = createLanguageMap(false);

        results.forEach((result, index) => {
          const language = LANGUAGE_OPTIONS[index]?.id;
          if (!language) return;
          if (result.status === 'fulfilled') {
            nextRecommendation[language] = result.value.payload;
            if (result.value.empty) {
              nextRecommendationEmpty[language] = true;
            }
          } else {
            nextRecommendationError[language] = result.reason?.message || 'Failed to load recommendation.';
          }
        });

        setRecommendation(nextRecommendation);
        setRecommendationError(nextRecommendationError);
        setRecommendationEmpty(nextRecommendationEmpty);
        setRecommendationLoading(nextRecommendationLoading);
      } catch (loadError) {
        if (isMounted) {
          setRecommendationLoading(createLanguageMap(false));
        }
      }
    }

    loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, [challengeMetadata]);

  useEffect(() => {
    let isMounted = true;

    async function loadTopicFitness() {
      setTopicFitnessLoading(true);
      setTopicFitnessError(null);
      try {
        const response = await fetch(`/api/topic-fitness?language=${selectedLanguage}`);
        if (!response.ok) {
          throw new Error('Failed to load topic fitness');
        }
        const data = await response.json();
        if (isMounted) {
          setTopicFitness(data.topics || []);
        }
      } catch (fitnessError) {
        if (isMounted) {
          setTopicFitnessError(fitnessError.message || 'Failed to load topic fitness.');
        }
      } finally {
        if (isMounted) {
          setTopicFitnessLoading(false);
        }
      }
    }

    loadTopicFitness();

    return () => {
      isMounted = false;
    };
  }, [selectedLanguage]);

  const isRecommendationLoading = LANGUAGE_OPTIONS.some(
    option => recommendationLoading[option.id]
  );
  const isFitnessTab = activeTopicTab === 'fitness';
  const isSubmissionsTab = activeTopicTab === 'submissions';
  const isActivityTab = activeTopicTab === 'activity';
  const topicFitnessSubtitle = isFitnessTab
    ? 'Weighted scores across your submissions'
    : isActivityTab
      ? 'Daily submission counts for the last 7 days'
      : 'Chronological list for the selected language';
  const activityTotal = activityData.reduce((sum, day) => sum + day.count, 0);
  const activityMax = activityData.reduce((max, day) => Math.max(max, day.count), 0);
  const pageCount = Math.max(1, Math.ceil(totalSubmissions / pageSize));
  const isFirstPage = page <= 1;
  const isLastPage = page >= pageCount;

  return (
    <div className="submissions-page">
      <header className="submissions-page-header">
        <div>
          <h1 className="submissions-page-title">All Submissions</h1>
          <p className="submissions-page-subtitle">Chronological list across all challenges</p>
        </div>
        <div className="submissions-page-actions">
          <select
            value={selectedLanguage}
            onChange={(event) => handleLanguageSwitch(event.target.value, selectedLanguage)}
            className="language-select"
            title="Select language"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            className="btn btn--sm submissions-page-button"
            type="button"
            onClick={handleExportCsv}
            disabled={totalSubmissions === 0 || isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <a className="submissions-page-link" href="/" rel="noreferrer">
            Back to editor
          </a>
        </div>
      </header>
      <main className="submissions-page-content">
        <section className="recommendation-panel">
          <div className="recommendation-panel-header">
            <div>
              <h2>Next Challenge Recommendation</h2>
              <p>Based on your submission history</p>
            </div>
            {recommendation[selectedLanguage] && (
              <button
                className="btn btn--outline btn--xs recommendation-toggle"
                type="button"
                onClick={() => setRecommendationExpanded((prev) => !prev)}
              >
                {recommendationExpanded ? 'Hide details' : 'Show details'}
              </button>
            )}
          </div>
          <div className="recommendation-panel-body">
            {isRecommendationLoading ? (
              <div className="recommendation-status">
                <span className="spinner" aria-hidden="true" />
                <span>Evaluating which challenge should be next</span>
              </div>
            ) : recommendationError[selectedLanguage] ? (
              <div className="recommendation-error">
                {recommendationError[selectedLanguage]}
              </div>
            ) : recommendationEmpty[selectedLanguage] ? (
              <div className="recommendation-status">No submissions yet.</div>
            ) : recommendation[selectedLanguage] ? (
              <div className="recommendation-result">
                <div className="recommendation-primary">
                  <div className="recommendation-name">
                    {recommendation[selectedLanguage].name}
                  </div>
                  <div className="recommendation-difficulty">
                    {recommendation[selectedLanguage].difficulty}
                  </div>
                </div>
                {recommendationExpanded && (
                  <div className="recommendation-details">
                    {recommendation[selectedLanguage].systemPrompt ||
                    recommendation[selectedLanguage].userPrompt ? (
                      <button
                        type="button"
                        className="btn btn--link recommendation-justification"
                        onClick={() => setIsPromptPopoverOpen(true)}
                      >
                        {recommendation[selectedLanguage].explanation}
                      </button>
                    ) : (
                      <div className="recommendation-justification">
                        {recommendation[selectedLanguage].explanation}
                      </div>
                    )}
                    <div className="recommendation-detail-line">
                      <span className="recommendation-detail-label">Difficulty</span>
                      <span>{recommendation[selectedLanguage].difficulty}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </section>
        <section className="topic-fitness-panel">
          <div className="topic-fitness-header">
            <div className="topic-fitness-header-main">
              <div className="topic-fitness-header-text">
                <h2>Topic Fitness &amp; Submissions</h2>
                <p>{topicFitnessSubtitle}</p>
              </div>
              <div className="topic-fitness-tabs" role="tablist" aria-label="Topic fitness views">
                <button
                  type="button"
                  id="topic-fitness-tab"
                  role="tab"
                  aria-selected={isFitnessTab}
                  aria-controls="topic-fitness-panel"
                  tabIndex={isFitnessTab ? 0 : -1}
                  className={`topic-fitness-tab${isFitnessTab ? ' is-active' : ''}`}
                  onClick={() => handleTopicTabChange('fitness')}
                >
                  Topic fitness
                </button>
                <button
                  type="button"
                  id="topic-activity-tab"
                  role="tab"
                  aria-selected={isActivityTab}
                  aria-controls="topic-fitness-activity-panel"
                  tabIndex={isActivityTab ? 0 : -1}
                  className={`topic-fitness-tab${isActivityTab ? ' is-active' : ''}`}
                  onClick={() => handleTopicTabChange('activity')}
                >
                  7-day activity
                </button>
                <button
                  type="button"
                  id="topic-submissions-tab"
                  role="tab"
                  aria-selected={isSubmissionsTab}
                  aria-controls="topic-fitness-submissions-panel"
                  tabIndex={isSubmissionsTab ? 0 : -1}
                  className={`topic-fitness-tab${isSubmissionsTab ? ' is-active' : ''}`}
                  onClick={() => handleTopicTabChange('submissions')}
                >
                  Submissions
                </button>
              </div>
            </div>
            <div className="topic-fitness-header-actions">
              {isFitnessTab && (
                <button
                  className="btn btn--outline btn--xs topic-fitness-criteria-button"
                  type="button"
                  onClick={() => setIsCriteriaPopoverOpen((prev) => !prev)}
                  aria-haspopup="dialog"
                  aria-expanded={isCriteriaPopoverOpen}
                  aria-controls="topic-fitness-criteria-popover"
                >
                  Show criteria
                </button>
              )}
            </div>
          </div>
          <div className="topic-fitness-body">
            {isFitnessTab && (
              <div
                role="tabpanel"
                id="topic-fitness-panel"
                aria-labelledby="topic-fitness-tab"
              >
                {topicFitnessLoading && (
                  <div className="topic-fitness-status">Calculating topic fitness...</div>
                )}
                {!topicFitnessLoading && topicFitnessError && (
                  <div className="topic-fitness-error">{topicFitnessError}</div>
                )}
                {!topicFitnessLoading && !topicFitnessError && topicFitness.length === 0 && (
                  <div className="topic-fitness-status">No topic data yet.</div>
                )}
                {!topicFitnessLoading && !topicFitnessError && topicFitness.length > 0 && (
                  <div className="topic-fitness-table-wrapper">
                    <table className="topic-fitness-table">
                      <thead>
                        <tr>
                          <th>Topic</th>
                          <th>Easy</th>
                          <th>Medium</th>
                          <th>Hard</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topicFitness.map((entry) => (
                          <tr key={entry.topic}>
                            <td>{entry.topic}</td>
                            <td>{renderDifficultyCell(entry, 'easy')}</td>
                            <td>{renderDifficultyCell(entry, 'medium')}</td>
                            <td>{renderDifficultyCell(entry, 'hard')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {isSubmissionsTab && (
              <div
                role="tabpanel"
                id="topic-fitness-submissions-panel"
                aria-labelledby="topic-submissions-tab"
              >
                {loading && <div className="submissions-page-status">Loading submissions...</div>}
                {error && !loading && <div className="submissions-page-error">{error}</div>}
                {!loading && !error && submissions.length === 0 && (
                  <div className="submissions-page-status">No submissions available.</div>
                )}
                {!loading && !error && submissions.length > 0 && (
                  <>
                    <div className="submissions-page-table-wrapper">
                      <table className="submissions-page-table">
                        <thead>
                          <tr>
                            <th>Problem Title</th>
                            <th>Difficulty</th>
                            <th>Submitted</th>
                            <th>Avg Runtime</th>
                            <th>Timer Time</th>
                            <th>Submit Attempts</th>
                            <th>Guidance</th>
                            <th>Tech Bar Label</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submissions.map((submission) => {
                            const challenge = challengeMap[submission.challenge] || {};
                            const title = challenge.name || submission.challenge || 'Unknown Challenge';
                            const difficulty = challenge.difficulty ?? UNKNOWN_DIFFICULTY;
                            return (
                              <tr key={submission.id || `${submission.challenge}-${submission.date}`}>
                                <td>{title}</td>
                                <td>{difficulty}</td>
                                <td>{formatDate(submission.date)}</td>
                                <td>{submission.avgTime ?? 'N/A'}ms</td>
                                <td>{formatTime(submission.timerTime)}</td>
                                <td>{formatAttempts(submission.submitAttempts)}</td>
                                <td>{submission.guidanceLevel ?? 'Independent'}</td>
                                <td>{submission.techBarLabel ?? 'None'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="submissions-page-pagination">
                      <button
                        className="btn btn--outline btn--sm"
                        type="button"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={isFirstPage}
                      >
                        Previous
                      </button>
                      <div className="submissions-page-pagination-meta">
                        <span>
                          Page {page} of {pageCount}
                        </span>
                        <span>{totalSubmissions} total</span>
                      </div>
                      <button
                        className="btn btn--outline btn--sm"
                        type="button"
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={isLastPage || !hasMore}
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            {isActivityTab && (
              <div
                role="tabpanel"
                id="topic-fitness-activity-panel"
                aria-labelledby="topic-activity-tab"
              >
                {activityLoading && (
                  <div className="topic-fitness-status">Loading submission activity...</div>
                )}
                {activityError && !activityLoading && (
                  <div className="topic-fitness-error">{activityError}</div>
                )}
                {!activityLoading && !activityError && activityData.length === 0 && (
                  <div className="topic-fitness-status">No activity data available.</div>
                )}
                {!activityLoading && !activityError && activityData.length > 0 && (
                  <div className="topic-fitness-activity">
                    <div className="topic-fitness-activity-summary">
                      <div>
                        <div className="topic-fitness-activity-title">Last 7 days</div>
                        <div className="topic-fitness-activity-subtitle">
                          Total submissions: {activityTotal}
                        </div>
                      </div>
                      <div className="topic-fitness-activity-average">
                        Avg per day: {(activityTotal / ACTIVITY_WINDOW_DAYS).toFixed(1)}
                      </div>
                    </div>
                    <div
                      className="topic-fitness-chart"
                      role="img"
                      aria-label="Submissions per day for the last 7 days"
                    >
                      {activityData.map((day) => {
                        const height = activityMax > 0 ? (day.count / activityMax) * 100 : 0;
                        return (
                          <div key={day.key} className="topic-fitness-chart-bar">
                            <div className="topic-fitness-chart-count">{day.count}</div>
                            <div
                              className="topic-fitness-chart-column"
                              style={{ height: `${height}%` }}
                            />
                            <div className="topic-fitness-chart-label">{day.label}</div>
                          </div>
                        );
                      })}
                    </div>
                    {activityTotal === 0 && (
                      <div className="topic-fitness-status">
                        No submissions in the last 7 days.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <TopicFitnessCriteriaPopover
        isOpen={isCriteriaPopoverOpen}
        onClose={() => setIsCriteriaPopoverOpen(false)}
        legend={TECH_BAR_LEGEND}
      />
      <LanguageSwitchPopover
        isOpen={Boolean(languagePopoverInfo)}
        onClose={() => setLanguagePopoverInfo(null)}
        fromLanguage={languagePopoverInfo?.from}
        toLanguage={languagePopoverInfo?.to}
      />
      <RecommendationPromptPopover
        isOpen={isPromptPopoverOpen}
        onClose={() => setIsPromptPopoverOpen(false)}
        systemPrompt={recommendation[selectedLanguage]?.systemPrompt}
        userPrompt={recommendation[selectedLanguage]?.userPrompt}
      />
    </div>
  );
}
