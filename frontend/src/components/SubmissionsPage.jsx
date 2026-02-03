import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Popover,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import RecommendationPromptPopover from './RecommendationPromptPopover';
import LanguageSwitchPopover from './LanguageSwitchPopover';
import TopicFitnessCriteriaPopover from './TopicFitnessCriteriaPopover';
import { getLanguagePreference, saveLanguagePreference, saveNextChallengeRecommendation } from '../utils/storage';

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
const FITNESS_GROUP_CHART_VIEWBOX = { width: 100, height: 100 };
const FITNESS_GROUP_CHART_PADDING = { top: 8, right: 6, bottom: 10, left: 6 };
const FITNESS_GROUP_DEFINITIONS = [
  {
    id: 'data-structures',
    label: 'Data Structures',
    color: '#2f6fdd',
    topics: new Set([
      'array',
      'string',
      'matrix',
      'hash table',
      'stack',
      'queue',
      'heap (priority queue)',
      'linked list',
      'tree',
      'binary tree',
      'binary search tree',
      'trie',
      'union-find',
      'graph theory',
      'data stream'
    ])
  },
  {
    id: 'algorithms',
    label: 'Algorithms & Paradigms',
    color: '#e07a2f',
    topics: new Set([
      'dynamic programming',
      'memoization',
      'backtracking',
      'recursion',
      'greedy',
      'divide and conquer',
      'binary search',
      'sorting',
      'merge sort',
      'bucket sort',
      'quickselect',
      'two pointers',
      'sliding window',
      'prefix sum',
      'monotonic stack',
      'monotonic queue',
      'breadth-first search',
      'depth-first search',
      'sweep line',
      'simulation',
      'counting',
      'enumeration',
      'string matching'
    ])
  },
  {
    id: 'math-bit',
    label: 'Math & Bit',
    color: '#1f9d6a',
    topics: new Set([
      'math',
      'number theory',
      'bit manipulation',
      'combinatorics',
      'geometry'
    ])
  },
  {
    id: 'other',
    label: 'Other (General/Design)',
    color: '#6b7280',
    topics: new Set(['general', 'design'])
  }
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

function formatDifficultyLabel(value) {
  if (!value) {
    return '';
  }
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function normalizeDifficultyLevel(value) {
  if (!value) {
    return null;
  }
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'easy' || normalized === 'medium' || normalized === 'hard') {
    return normalized;
  }
  return null;
}

function extractTopics(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch (error) {
      return [];
    }
  }
  return [];
}

function normalizeTopicLabel(value) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().toLowerCase();
}

function getTopicTimerKey(topic, difficulty) {
  return `${topic}::${difficulty}`;
}

function buildTopicTimerStats(allSubmissions, challengeMap) {
  const stats = {};
  (allSubmissions || []).forEach((submission) => {
    const challenge = challengeMap?.[submission.challenge];
    if (!challenge) {
      return;
    }
    const difficulty = normalizeDifficultyLevel(challenge.difficulty);
    if (!difficulty) {
      return;
    }
    const topics = extractTopics(challenge.topics);
    if (topics.length === 0) {
      return;
    }
    const timerTime = Number(submission.timerTime);
    const hasTrackedTimer = Number.isFinite(timerTime) && timerTime > 0;
    topics.forEach((topic) => {
      const key = getTopicTimerKey(topic, difficulty);
      if (!stats[key]) {
        stats[key] = { submissionCount: 0, timerSum: 0, timerCount: 0 };
      }
      stats[key].submissionCount += 1;
      if (hasTrackedTimer) {
        stats[key].timerSum += timerTime;
        stats[key].timerCount += 1;
      }
    });
  });

  const averages = {};
  Object.entries(stats).forEach(([key, stat]) => {
    const avgTimerTime = stat.timerCount > 0
      ? Math.round(stat.timerSum / stat.timerCount)
      : -1;
    averages[key] = { ...stat, avgTimerTime };
  });
  return averages;
}

function getEntrySubmissionCount(entry) {
  const count = entry?.submission_count ?? entry?.submissionCount ?? 0;
  const parsed = Number(count);
  return Number.isFinite(parsed) ? parsed : 0;
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

function buildFitnessGroupTrend(historyEntries, days) {
  const buckets = buildRecentDayBuckets(days);
  if (!Array.isArray(historyEntries) || historyEntries.length === 0) {
    return { buckets, series: [] };
  }

  const daySnapshots = new Map();
  historyEntries.forEach((entry) => {
    const snapshot = entry?.snapshot_at ?? entry?.snapshotAt;
    const timestamp = snapshot ? Date.parse(snapshot) : NaN;
    if (Number.isNaN(timestamp)) {
      return;
    }
    const date = new Date(timestamp);
    const dayKey = getLocalDateKey(date);
    const existing = daySnapshots.get(dayKey);
    if (!existing || timestamp > existing.timestamp) {
      daySnapshots.set(dayKey, { timestamp, entries: [entry] });
      return;
    }
    if (timestamp === existing.timestamp) {
      existing.entries.push(entry);
    }
  });

  const series = FITNESS_GROUP_DEFINITIONS.map((group) => {
    const data = buckets.map((bucket) => {
      const daySnapshot = daySnapshots.get(bucket.key);
      if (!daySnapshot) {
        return { ...bucket, value: null };
      }
      const entries = daySnapshot.entries || [];
      const matching = entries.filter((entry) => {
        const topic = normalizeTopicLabel(entry?.topic);
        if (!topic || !group.topics.has(topic)) {
          return false;
        }
        return getEntrySubmissionCount(entry) > 0;
      });
      if (matching.length === 0) {
        return { ...bucket, value: null };
      }
      const total = matching.reduce((sum, entry) => {
        const fitness = Number(entry?.fitness);
        return sum + (Number.isFinite(fitness) ? fitness : 0);
      }, 0);
      const avg = total / matching.length;
      const clamped = Math.max(0, Math.min(1, avg));
      return { ...bucket, value: clamped };
    });

    return {
      id: group.id,
      label: group.label,
      color: group.color,
      data
    };
  }).filter((groupSeries) => groupSeries.data.some((point) => Number.isFinite(point.value)));

  return { buckets, series };
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

function buildLinePoints(values, viewBox, padding) {
  const width = viewBox.width;
  const height = viewBox.height;
  const plotWidth = Math.max(1, width - padding.left - padding.right);
  const plotHeight = Math.max(1, height - padding.top - padding.bottom);
  const totalPoints = values.length;
  return values.map((point, index) => {
    if (!Number.isFinite(point?.value)) {
      return null;
    }
    const normalized = Math.max(0, Math.min(1, point.value));
    const ratio = totalPoints > 1 ? index / (totalPoints - 1) : 0;
    const x = padding.left + ratio * plotWidth;
    const y = padding.top + (1 - normalized) * plotHeight;
    return { x, y };
  });
}

function buildLinePath(points) {
  let path = '';
  let started = false;
  points.forEach((point) => {
    if (!point) {
      return;
    }
    path += `${started ? ' L' : 'M'} ${point.x} ${point.y}`;
    started = true;
  });
  return path.trim();
}

function findChallengeByName(name, challenges) {
  if (!name) {
    return null;
  }
  const normalized = String(name).trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  return (challenges || []).find(
    (challenge) => String(challenge?.name || '').trim().toLowerCase() === normalized
  ) || null;
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
  const [groupFitnessTrend, setGroupFitnessTrend] = useState(() => ({
    buckets: buildRecentDayBuckets(ACTIVITY_WINDOW_DAYS),
    series: []
  }));
  const [groupFitnessLoading, setGroupFitnessLoading] = useState(false);
  const [groupFitnessError, setGroupFitnessError] = useState(null);
  const [topicTimerStats, setTopicTimerStats] = useState({});
  const [topicTimerStatsLoading, setTopicTimerStatsLoading] = useState(false);
  const [topicTimerStatsError, setTopicTimerStatsError] = useState(null);
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
  const [gradePopoverAnchorEl, setGradePopoverAnchorEl] = useState(null);
  const [gradePopoverInfo, setGradePopoverInfo] = useState(null);
  const gradePopoverCloseTimeoutRef = useRef(null);

  function getFitnessGrade(fitness) {
    const normalized = Math.max(0, Math.min(1, fitness));
    return (
      FITNESS_GRADE_BANDS.find((band) => normalized >= band.min) ||
      FITNESS_GRADE_BANDS[FITNESS_GRADE_BANDS.length - 1]
    );
  }

  function clearGradePopoverCloseTimer() {
    if (gradePopoverCloseTimeoutRef.current) {
      clearTimeout(gradePopoverCloseTimeoutRef.current);
      gradePopoverCloseTimeoutRef.current = null;
    }
  }

  function closeGradePopover() {
    clearGradePopoverCloseTimer();
    setGradePopoverAnchorEl(null);
    setGradePopoverInfo(null);
  }

  function scheduleGradePopoverClose() {
    clearGradePopoverCloseTimer();
    gradePopoverCloseTimeoutRef.current = setTimeout(() => {
      setGradePopoverAnchorEl(null);
      setGradePopoverInfo(null);
    }, 120);
  }

  function handleGradePopoverOpen(event, payload) {
    clearGradePopoverCloseTimer();
    setGradePopoverAnchorEl(event.currentTarget);
    setGradePopoverInfo(payload);
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
    const popoverPayload = {
      topic: entry?.topic,
      difficulty: level,
      grade: grade.grade,
      status: grade.status,
      submissionCount
    };

    return (
      <div className="topic-fitness-cell">
        <div className="topic-fitness-score" aria-label={`${grade.grade} ${grade.status}`}>
          <span
            className={`topic-fitness-grade grade-${grade.tone}`}
            onMouseEnter={(event) => handleGradePopoverOpen(event, popoverPayload)}
            onMouseLeave={scheduleGradePopoverClose}
            onFocus={(event) => handleGradePopoverOpen(event, popoverPayload)}
            onBlur={scheduleGradePopoverClose}
            tabIndex={0}
          >
            {grade.grade}
          </span>
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

  async function fetchTopicFitnessHistory({ since, until, language } = {}) {
    const params = new URLSearchParams();
    if (since) {
      params.set('since', since);
    }
    if (until) {
      params.set('until', until);
    }
    if (language) {
      params.set('language', normalizeLanguage(language));
    }
    const response = await fetch(`/api/topic-fitness-history?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to load topic fitness history');
    }
    const data = await response.json();
    return Array.isArray(data.history) ? data.history : [];
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
    closeGradePopover();
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
    if (nextTab !== 'fitness') {
      closeGradePopover();
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
        difficulty: challenge.difficulty,
        topics: challenge.topics ?? []
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
        difficulty: UNKNOWN_DIFFICULTY,
        topics: []
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
    if (activeTopicTab !== 'activity') {
      return undefined;
    }
    let isMounted = true;

    async function loadGroupFitnessTrend() {
      setGroupFitnessLoading(true);
      setGroupFitnessError(null);
      try {
        const start = getStartOfLocalDay(new Date());
        start.setDate(start.getDate() - (ACTIVITY_WINDOW_DAYS - 1));
        const history = await fetchTopicFitnessHistory({
          since: start.toISOString(),
          language: selectedLanguage
        });
        if (!isMounted) {
          return;
        }
        setGroupFitnessTrend(buildFitnessGroupTrend(history, ACTIVITY_WINDOW_DAYS));
      } catch (loadError) {
        if (isMounted) {
          setGroupFitnessError(loadError.message || 'Failed to load fitness history.');
          setGroupFitnessTrend({
            buckets: buildRecentDayBuckets(ACTIVITY_WINDOW_DAYS),
            series: []
          });
        }
      } finally {
        if (isMounted) {
          setGroupFitnessLoading(false);
        }
      }
    }

    loadGroupFitnessTrend();

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
              return { empty: true, payload: buildFallbackRecommendation(language), submissionCount: 0 };
            }

            const recentSubmissions = await fetchAllSubmissions({ language, from });
            const submissionCount = recentSubmissions.length;
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
              },
              submissionCount
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
            const { payload, empty, submissionCount } = result.value;
            nextRecommendation[language] = payload;
            if (empty) {
              nextRecommendationEmpty[language] = true;
            } else {
              const matched = findChallengeByName(payload?.name, challengeMetadata);
              saveNextChallengeRecommendation(language, {
                ...payload,
                challengeId: matched ? matched.id : null,
                submissionCount
              });
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

  useEffect(() => {
    let isMounted = true;

    if (activeTopicTab !== 'fitness') {
      return undefined;
    }

    if (!challengeMap || Object.keys(challengeMap).length === 0) {
      setTopicTimerStats({});
      setTopicTimerStatsLoading(false);
      setTopicTimerStatsError(null);
      return undefined;
    }

    async function loadTopicTimerStats() {
      setTopicTimerStatsLoading(true);
      setTopicTimerStatsError(null);
      try {
        const allSubmissions = await fetchAllSubmissions({ language: selectedLanguage });
        if (!isMounted) {
          return;
        }
        setTopicTimerStats(buildTopicTimerStats(allSubmissions, challengeMap));
      } catch (statsError) {
        if (isMounted) {
          setTopicTimerStats({});
          setTopicTimerStatsError(statsError.message || 'Failed to load timer stats.');
        }
      } finally {
        if (isMounted) {
          setTopicTimerStatsLoading(false);
        }
      }
    }

    loadTopicTimerStats();

    return () => {
      isMounted = false;
    };
  }, [activeTopicTab, selectedLanguage, challengeMap]);

  useEffect(() => () => clearGradePopoverCloseTimer(), []);

  const isRecommendationLoading = LANGUAGE_OPTIONS.some(
    option => recommendationLoading[option.id]
  );
  const isFitnessTab = activeTopicTab === 'fitness';
  const isSubmissionsTab = activeTopicTab === 'submissions';
  const isActivityTab = activeTopicTab === 'activity';
  const groupFitnessSeries = groupFitnessTrend.series || [];
  const groupFitnessBuckets = groupFitnessTrend.buckets || [];
  const groupFitnessChartSeries = groupFitnessSeries.map((series) => {
    const points = buildLinePoints(
      series.data || [],
      FITNESS_GROUP_CHART_VIEWBOX,
      FITNESS_GROUP_CHART_PADDING
    );
    return {
      ...series,
      points,
      path: buildLinePath(points)
    };
  });
  const gradePopoverKey = gradePopoverInfo
    ? getTopicTimerKey(gradePopoverInfo.topic, gradePopoverInfo.difficulty)
    : null;
  const gradePopoverStats = gradePopoverKey ? topicTimerStats[gradePopoverKey] : null;
  const gradePopoverAvgTimerTime = gradePopoverStats?.avgTimerTime;
  const gradePopoverAvgTimerLabel = topicTimerStatsError
    ? 'Unavailable'
    : topicTimerStatsLoading
      ? 'Loading...'
      : gradePopoverAvgTimerTime === null || gradePopoverAvgTimerTime === undefined
        ? 'N/A'
        : formatTime(gradePopoverAvgTimerTime);
  const gradePopoverTitle = gradePopoverInfo?.topic
    ? `${gradePopoverInfo.topic} - ${formatDifficultyLabel(gradePopoverInfo.difficulty)}`
    : '';
  const gradePopoverSubtitle = gradePopoverInfo?.grade
    ? `Grade ${gradePopoverInfo.grade}`
    : '';
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
          <Button
            className="btn btn--sm submissions-page-button"
            type="button"
            onClick={handleExportCsv}
            disabled={totalSubmissions === 0 || isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
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
              <Button
                className="btn btn--outline btn--xs recommendation-toggle"
                type="button"
                onClick={() => setRecommendationExpanded((prev) => !prev)}
              >
                {recommendationExpanded ? 'Hide details' : 'Show details'}
              </Button>
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
                      <Button
                        type="button"
                        className="btn btn--link recommendation-justification"
                        onClick={() => setIsPromptPopoverOpen(true)}
                      >
                        {recommendation[selectedLanguage].explanation}
                      </Button>
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
              <Tabs
                className="topic-fitness-tabs"
                value={activeTopicTab}
                onChange={(event, newValue) => handleTopicTabChange(newValue)}
                aria-label="Topic fitness views"
                TabIndicatorProps={{ style: { display: 'none' } }}
              >
                <Tab
                  id="topic-fitness-tab"
                  aria-controls="topic-fitness-panel"
                  className={`topic-fitness-tab${isFitnessTab ? ' is-active' : ''}`}
                  label="Topic fitness"
                  value="fitness"
                />
                <Tab
                  id="topic-activity-tab"
                  aria-controls="topic-fitness-activity-panel"
                  className={`topic-fitness-tab${isActivityTab ? ' is-active' : ''}`}
                  label="7-day activity"
                  value="activity"
                />
                <Tab
                  id="topic-submissions-tab"
                  aria-controls="topic-fitness-submissions-panel"
                  className={`topic-fitness-tab${isSubmissionsTab ? ' is-active' : ''}`}
                  label="Submissions"
                  value="submissions"
                />
              </Tabs>
            </div>
            <div className="topic-fitness-header-actions">
              {isFitnessTab && (
                <Button
                  className="btn btn--outline btn--xs topic-fitness-criteria-button"
                  type="button"
                  onClick={() => setIsCriteriaPopoverOpen((prev) => !prev)}
                  aria-haspopup="dialog"
                  aria-expanded={isCriteriaPopoverOpen}
                  aria-controls="topic-fitness-criteria-popover"
                >
                  Show criteria
                </Button>
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
                  <TableContainer className="topic-fitness-table-wrapper">
                    <Table className="topic-fitness-table" size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Topic</TableCell>
                          <TableCell>Easy</TableCell>
                          <TableCell>Medium</TableCell>
                          <TableCell>Hard</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topicFitness.map((entry) => (
                          <TableRow key={entry.topic}>
                            <TableCell>{entry.topic}</TableCell>
                            <TableCell>{renderDifficultyCell(entry, 'easy')}</TableCell>
                            <TableCell>{renderDifficultyCell(entry, 'medium')}</TableCell>
                            <TableCell>{renderDifficultyCell(entry, 'hard')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                    <TableContainer className="submissions-page-table-wrapper">
                      <Table className="submissions-page-table" size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Problem Title</TableCell>
                            <TableCell>Difficulty</TableCell>
                            <TableCell>Submitted</TableCell>
                            <TableCell>Avg Runtime</TableCell>
                            <TableCell>Timer Time</TableCell>
                            <TableCell>Submit Attempts</TableCell>
                            <TableCell>Guidance</TableCell>
                            <TableCell>Tech Bar Label</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {submissions.map((submission) => {
                            const challenge = challengeMap[submission.challenge] || {};
                            const title = challenge.name || submission.challenge || 'Unknown Challenge';
                            const difficulty = challenge.difficulty ?? UNKNOWN_DIFFICULTY;
                            return (
                              <TableRow key={submission.id || `${submission.challenge}-${submission.date}`}>
                                <TableCell>{title}</TableCell>
                                <TableCell>{difficulty}</TableCell>
                                <TableCell>{formatDate(submission.date)}</TableCell>
                                <TableCell>{submission.avgTime ?? 'N/A'}ms</TableCell>
                                <TableCell>{formatTime(submission.timerTime)}</TableCell>
                                <TableCell>{formatAttempts(submission.submitAttempts)}</TableCell>
                                <TableCell>{submission.guidanceLevel ?? 'Independent'}</TableCell>
                                <TableCell>{submission.techBarLabel ?? 'None'}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div className="submissions-page-pagination">
                      <Button
                        className="btn btn--outline btn--sm"
                        type="button"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={isFirstPage}
                      >
                        Previous
                      </Button>
                      <div className="submissions-page-pagination-meta">
                        <span>
                          Page {page} of {pageCount}
                        </span>
                        <span>{totalSubmissions} total</span>
                      </div>
                      <Button
                        className="btn btn--outline btn--sm"
                        type="button"
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={isLastPage || !hasMore}
                      >
                        Next
                      </Button>
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
                    <div className="topic-fitness-group-activity">
                      <div className="topic-fitness-group-activity-header">
                        <div>
                          <div className="topic-fitness-group-activity-title">
                            Average fitness by topic group
                          </div>
                          <div className="topic-fitness-group-activity-subtitle">
                            Last 7 days
                          </div>
                        </div>
                        <div className="topic-fitness-group-activity-range">Scale: 0-1</div>
                      </div>
                      {groupFitnessLoading && (
                        <div className="topic-fitness-status">Loading fitness history...</div>
                      )}
                      {groupFitnessError && !groupFitnessLoading && (
                        <div className="topic-fitness-error">{groupFitnessError}</div>
                      )}
                      {!groupFitnessLoading &&
                        !groupFitnessError &&
                        groupFitnessChartSeries.length === 0 && (
                          <div className="topic-fitness-status">
                            No fitness history in the last 7 days.
                          </div>
                        )}
                      {!groupFitnessLoading &&
                        !groupFitnessError &&
                        groupFitnessChartSeries.length > 0 && (
                          <>
                            <div className="topic-fitness-group-activity-legend">
                              {groupFitnessChartSeries.map((series) => (
                                <div
                                  key={series.id}
                                  className="topic-fitness-group-activity-legend-item"
                                >
                                  <span
                                    className="topic-fitness-group-activity-legend-swatch"
                                    style={{ backgroundColor: series.color }}
                                  />
                                  <span>{series.label}</span>
                                </div>
                              ))}
                            </div>
                            <div
                              className="topic-fitness-group-activity-chart"
                              role="img"
                              aria-label="Average fitness by topic group for the last 7 days"
                            >
                              <svg
                                viewBox={`0 0 ${FITNESS_GROUP_CHART_VIEWBOX.width} ${FITNESS_GROUP_CHART_VIEWBOX.height}`}
                                className="topic-fitness-group-activity-svg"
                                aria-hidden="true"
                                preserveAspectRatio="none"
                              >
                                {groupFitnessChartSeries.map((series) => (
                                  <path
                                    key={series.id}
                                    d={series.path}
                                    className="topic-fitness-group-activity-line"
                                    style={{ stroke: series.color }}
                                  />
                                ))}
                              </svg>
                            </div>
                            <div className="topic-fitness-group-activity-labels">
                              {groupFitnessBuckets.map((bucket) => (
                                <div key={bucket.key}>{bucket.label}</div>
                              ))}
                            </div>
                          </>
                        )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Popover
        open={Boolean(gradePopoverAnchorEl && gradePopoverInfo)}
        anchorEl={gradePopoverAnchorEl}
        onClose={closeGradePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        disableRestoreFocus
        PaperProps={{
          className: 'topic-fitness-grade-popover',
          onMouseEnter: clearGradePopoverCloseTimer,
          onMouseLeave: scheduleGradePopoverClose
        }}
      >
        <div className="topic-fitness-grade-popover-header">
          <div className="topic-fitness-grade-popover-title">{gradePopoverTitle}</div>
          {gradePopoverSubtitle && (
            <div className="topic-fitness-grade-popover-subtitle">{gradePopoverSubtitle}</div>
          )}
        </div>
        <div className="topic-fitness-grade-popover-body">
          <div className="topic-fitness-grade-popover-row">
            <span className="topic-fitness-grade-popover-label">Submissions</span>
            <span className="topic-fitness-grade-popover-value">
              {gradePopoverInfo?.submissionCount ?? 0}
            </span>
          </div>
          <div className="topic-fitness-grade-popover-row">
            <span className="topic-fitness-grade-popover-label">Avg timer time</span>
            <span className="topic-fitness-grade-popover-value">{gradePopoverAvgTimerLabel}</span>
          </div>
        </div>
      </Popover>
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
