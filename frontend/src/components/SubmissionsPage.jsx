import React, { useState, useEffect } from 'react';
import RecommendationPromptPopover from './RecommendationPromptPopover';

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

function formatFitness(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'N/A';
  }
  return `${(value * 100).toFixed(1)}%`;
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
  const [topicFitness, setTopicFitness] = useState([]);
  const [topicFitnessLoading, setTopicFitnessLoading] = useState(false);
  const [topicFitnessError, setTopicFitnessError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [recommendationLoading, setRecommendationLoading] = useState(createLanguageMap(false));
  const [recommendationError, setRecommendationError] = useState(createLanguageMap(null));
  const [recommendation, setRecommendation] = useState(createLanguageMap(null));
  const [selectedRecommendationLanguage, setSelectedRecommendationLanguage] = useState('java');
  const [recommendationExpanded, setRecommendationExpanded] = useState(false);
  const [recommendationEmpty, setRecommendationEmpty] = useState(createLanguageMap(false));
  const [isPromptPopoverOpen, setIsPromptPopoverOpen] = useState(false);

  function renderDifficultyCell(entry, level) {
    const data = entry?.[level] || {};
    return (
      <div className="topic-fitness-cell">
        <div className="topic-fitness-metric">Fitness: {formatFitness(data.fitness)}</div>
        <div className="topic-fitness-metric">Submissions: {data.submissionCount ?? 0}</div>
        <div className="topic-fitness-metric">
          Last: {data.lastSubmission ? formatDate(data.lastSubmission) : 'N/A'}
        </div>
      </div>
    );
  }

  function handleExportCsv() {
    const headers = [
      'Problem Title',
      'Difficulty',
      'Submitted',
      'Avg Runtime',
      'Timer Time',
      'Submit Attempts',
      'Guidance',
      'Tech Bar Status',
      'Tech Bar Label'
    ];

    const rows = submissions.map((submission) => {
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
        submission.techBarStatus ?? 'pending',
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

  useEffect(() => {
    let isMounted = true;

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

    async function loadSubmissions() {
      setLoading(true);
      setError(null);
      setRecommendationLoading(createLanguageMap(true));
      setRecommendationError(createLanguageMap(null));
      setRecommendation(createLanguageMap(null));
      setRecommendationExpanded(false);
      setRecommendationEmpty(createLanguageMap(false));
      setIsPromptPopoverOpen(false);
      try {
        const challenges = await fetchChallengesMetadata();
        const map = challenges.reduce((acc, challenge) => {
          acc[challenge.id] = challenge;
          return acc;
        }, {});

        const submissionsByChallenge = await Promise.all(
          challenges.map(async (challenge) => {
            try {
              const response = await fetch(`/api/submissions?challenge=${challenge.id}`);
              if (!response.ok) {
                throw new Error('Failed to load submissions');
              }
              const data = await response.json();
              return (data.submissions || []).map((submission) => ({
                ...submission,
                challenge: submission.challenge ?? challenge.id
              }));
            } catch (submissionError) {
              return [];
            }
          })
        );

        const allSubmissions = submissionsByChallenge.flat();
        allSubmissions.sort((a, b) => {
          const dateA = new Date(a.date || 0).getTime();
          const dateB = new Date(b.date || 0).getTime();
          return dateB - dateA;
        });

        if (isMounted) {
          setChallengeMap(map);
          setSubmissions(allSubmissions);
        }

        if (isMounted) {
          const buildRecommendationRequest = async (language) => {
            const filteredSubmissions = allSubmissions.filter(
              (submission) => normalizeLanguage(submission.language) === language
            );
            if (filteredSubmissions.length === 0) {
              return { status: 'ok', payload: buildFallbackRecommendation(language) };
            }
            const response = await fetch('/api/recommend-next-challenge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                submissions: filteredSubmissions,
                challenges
              })
            });

            if (!response.ok) {
              throw new Error('Failed to load recommendation');
            }

            const data = await response.json();
            return {
              status: 'ok',
              payload: {
                name: data.name,
                difficulty: data.difficulty,
                explanation: data.explanation,
                systemPrompt: data.systemPrompt,
                userPrompt: data.userPrompt
              }
            };
          };

          const results = await Promise.allSettled(
            LANGUAGE_OPTIONS.map((option) => buildRecommendationRequest(option.id))
          );

          const nextRecommendation = createLanguageMap(null);
          const nextRecommendationError = createLanguageMap(null);
          const nextRecommendationLoading = createLanguageMap(false);

          results.forEach((result, index) => {
            const language = LANGUAGE_OPTIONS[index]?.id;
            if (!language) return;
            if (result.status === 'fulfilled') {
              nextRecommendation[language] = result.value.payload;
            } else {
              nextRecommendationError[language] = result.reason?.message || 'Failed to load recommendation.';
            }
          });

          setRecommendation(nextRecommendation);
          setRecommendationError(nextRecommendationError);
          setRecommendationEmpty(createLanguageMap(false));
          setRecommendationLoading(nextRecommendationLoading);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Failed to load submissions.');
          setRecommendationLoading(createLanguageMap(false));
          setTopicFitnessLoading(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSubmissions();

    return () => {
      isMounted = false;
    };
  }, []);

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

  return (
    <div className="submissions-page">
      <header className="submissions-page-header">
        <div>
          <h1 className="submissions-page-title">All Submissions</h1>
          <p className="submissions-page-subtitle">Chronological list across all challenges</p>
        </div>
        <div className="submissions-page-actions">
          <button
            className="submissions-page-button"
            type="button"
            onClick={handleExportCsv}
            disabled={submissions.length === 0}
          >
            Export CSV
          </button>
          <a className="submissions-page-link" href="/" rel="noreferrer">
            Back to editor
          </a>
        </div>
      </header>
      <main className="submissions-page-content">
        <section className="topic-fitness-panel">
          <div className="topic-fitness-header">
            <div>
              <h2>Topic Fitness</h2>
              <p>Weighted scores across your submissions</p>
            </div>
            <div className="topic-fitness-tabs" role="tablist" aria-label="Topic fitness language">
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  className={`topic-fitness-tab ${selectedLanguage === option.id ? 'is-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={selectedLanguage === option.id}
                  onClick={() => setSelectedLanguage(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="topic-fitness-body">
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
        </section>
        <section className="submissions-legend">
          <div className="submissions-legend-header">
            <h2>Tech Bar Standard (minutes)</h2>
            <p>Reference targets by difficulty</p>
          </div>
          <div className="submissions-legend-grid">
            {TECH_BAR_LEGEND.map((entry) => (
              <div key={entry.tier} className="submissions-legend-card">
                <div className="submissions-legend-tier">{entry.tier}</div>
                <div className="submissions-legend-pills">
                  {Object.entries(entry.minutes).map(([difficulty, minutes]) => (
                    <span key={difficulty} className={`submissions-legend-pill ${difficulty.toLowerCase()}`}>
                      {difficulty}: {minutes} min
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="recommendation-panel">
          <div className="recommendation-panel-header">
            <div>
              <h2>Next Challenge Recommendation</h2>
              <p>Based on your submission history</p>
            </div>
            <div className="topic-fitness-tabs" role="tablist" aria-label="Recommendation language">
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  className={`topic-fitness-tab ${selectedRecommendationLanguage === option.id ? 'is-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={selectedRecommendationLanguage === option.id}
                  onClick={() => setSelectedRecommendationLanguage(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {recommendation[selectedRecommendationLanguage] && (
              <button
                className="recommendation-toggle"
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
            ) : recommendationError[selectedRecommendationLanguage] ? (
              <div className="recommendation-error">
                {recommendationError[selectedRecommendationLanguage]}
              </div>
            ) : recommendationEmpty[selectedRecommendationLanguage] ? (
              <div className="recommendation-status">No submissions yet.</div>
            ) : recommendation[selectedRecommendationLanguage] ? (
              <div className="recommendation-result">
                <div className="recommendation-primary">
                  <div className="recommendation-name">
                    {recommendation[selectedRecommendationLanguage].name}
                  </div>
                  <div className="recommendation-difficulty">
                    {recommendation[selectedRecommendationLanguage].difficulty}
                  </div>
                </div>
                {recommendationExpanded && (
                  <div className="recommendation-details">
                    {recommendation[selectedRecommendationLanguage].systemPrompt ||
                    recommendation[selectedRecommendationLanguage].userPrompt ? (
                      <button
                        type="button"
                        className="recommendation-justification"
                        onClick={() => setIsPromptPopoverOpen(true)}
                      >
                        {recommendation[selectedRecommendationLanguage].explanation}
                      </button>
                    ) : (
                      <div className="recommendation-justification">
                        {recommendation[selectedRecommendationLanguage].explanation}
                      </div>
                    )}
                    <div className="recommendation-detail-line">
                      <span className="recommendation-detail-label">Difficulty</span>
                      <span>{recommendation[selectedRecommendationLanguage].difficulty}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </section>
        {loading && <div className="submissions-page-status">Loading submissions...</div>}
        {error && !loading && <div className="submissions-page-error">{error}</div>}
        {!loading && !error && submissions.length === 0 && (
          <div className="submissions-page-status">No submissions available.</div>
        )}
        {!loading && !error && submissions.length > 0 && (
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
                  <th>Tech Bar Status</th>
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
                      <td>{submission.techBarStatus ?? 'pending'}</td>
                      <td>{submission.techBarLabel ?? 'None'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <RecommendationPromptPopover
        isOpen={isPromptPopoverOpen}
        onClose={() => setIsPromptPopoverOpen(false)}
        systemPrompt={recommendation[selectedRecommendationLanguage]?.systemPrompt}
        userPrompt={recommendation[selectedRecommendationLanguage]?.userPrompt}
      />
    </div>
  );
}
