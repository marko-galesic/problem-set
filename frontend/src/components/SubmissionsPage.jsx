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

const GRAPH_DIFFICULTY_COLUMNS = ['easy', 'medium', 'hard', 'unknown'];
const GRAPH_COLUMN_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  unknown: 'Unknown'
};
const GRAPH_COLUMN_WIDTH = 260;
const GRAPH_ROW_HEIGHT = 90;
const GRAPH_NODE_RADIUS = 18;
const GRAPH_PADDING = { x: 40, y: 48 };
const GRAPH_SCALE_LIMITS = { min: 0.4, max: 2.5 };

function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeGraphDifficulty(value) {
  if (typeof value !== 'string') {
    return 'unknown';
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === 'easy' || normalized === 'medium' || normalized === 'hard') {
    return normalized;
  }
  return 'unknown';
}

function buildGraphLayout(nodes = [], edges = []) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return {
      nodes: [],
      edges: [],
      positions: new Map(),
      width: 0,
      height: 0,
      columnLabels: []
    };
  }

  const normalizedNodes = nodes.map((node) => ({
    ...node,
    difficulty: normalizeGraphDifficulty(node.difficulty)
  }));
  const nodesById = new Map(normalizedNodes.map((node) => [node.id, node]));
  const prerequisiteMap = new Map();

  for (const edge of edges || []) {
    if (!edge || !edge.from || !edge.to) {
      continue;
    }
    if (!nodesById.has(edge.from) || !nodesById.has(edge.to)) {
      continue;
    }
    if (!prerequisiteMap.has(edge.to)) {
      prerequisiteMap.set(edge.to, []);
    }
    prerequisiteMap.get(edge.to).push(edge.from);
  }

  const depthMemo = new Map();
  const visiting = new Set();
  const getDepth = (id) => {
    if (depthMemo.has(id)) {
      return depthMemo.get(id);
    }
    if (visiting.has(id)) {
      return 0;
    }
    visiting.add(id);
    const prereqs = prerequisiteMap.get(id) || [];
    let depth = 0;
    for (const prereqId of prereqs) {
      depth = Math.max(depth, getDepth(prereqId) + 1);
    }
    visiting.delete(id);
    depthMemo.set(id, depth);
    return depth;
  };

  const columns = new Map();
  for (const node of normalizedNodes) {
    const columnKey = GRAPH_DIFFICULTY_COLUMNS.includes(node.difficulty)
      ? node.difficulty
      : 'unknown';
    if (!columns.has(columnKey)) {
      columns.set(columnKey, []);
    }
    columns.get(columnKey).push(node);
  }

  const positions = new Map();
  let maxRows = 0;

  GRAPH_DIFFICULTY_COLUMNS.forEach((columnKey, columnIndex) => {
    const group = columns.get(columnKey) || [];
    group.sort((a, b) => {
      const depthA = getDepth(a.id);
      const depthB = getDepth(b.id);
      if (depthA !== depthB) {
        return depthA - depthB;
      }
      if (Boolean(a.hasSubmission) !== Boolean(b.hasSubmission)) {
        return a.hasSubmission ? -1 : 1;
      }
      return String(a.name || a.id).localeCompare(String(b.name || b.id));
    });
    maxRows = Math.max(maxRows, group.length);
    group.forEach((node, rowIndex) => {
      positions.set(node.id, {
        x: GRAPH_PADDING.x + columnIndex * GRAPH_COLUMN_WIDTH,
        y: GRAPH_PADDING.y + rowIndex * GRAPH_ROW_HEIGHT
      });
    });
  });

  const width = GRAPH_PADDING.x * 2 + GRAPH_COLUMN_WIDTH * (GRAPH_DIFFICULTY_COLUMNS.length - 1) + 260;
  const height = GRAPH_PADDING.y * 2 + Math.max(1, maxRows) * GRAPH_ROW_HEIGHT;
  const columnLabels = GRAPH_DIFFICULTY_COLUMNS.map((columnKey, columnIndex) => ({
    key: columnKey,
    label: GRAPH_COLUMN_LABELS[columnKey] || columnKey,
    x: GRAPH_PADDING.x + columnIndex * GRAPH_COLUMN_WIDTH,
    y: Math.max(24, GRAPH_PADDING.y - 18)
  }));

  return {
    nodes: normalizedNodes,
    edges: Array.isArray(edges) ? edges : [],
    positions,
    width,
    height,
    columnLabels
  };
}

function buildGraphEdgePath(from, to) {
  const dx = to.x - from.x;
  const curve = Math.max(40, Math.abs(dx) * 0.35);
  const controlX1 = from.x + (dx >= 0 ? curve : -curve);
  const controlX2 = to.x - (dx >= 0 ? curve : -curve);
  return `M ${from.x} ${from.y} C ${controlX1} ${from.y}, ${controlX2} ${to.y}, ${to.x} ${to.y}`;
}

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

function formatScore(value, digits = 2) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 'N/A';
  }
  return numeric.toFixed(digits);
}

function formatCount(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 'N/A';
  }
  return String(numeric);
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
  const [retentionMetrics, setRetentionMetrics] = useState([]);
  const [retentionMetricsLoading, setRetentionMetricsLoading] = useState(false);
  const [retentionMetricsError, setRetentionMetricsError] = useState(null);
  const [retentionMetricsMeta, setRetentionMetricsMeta] = useState({
    computedAt: null,
    fitnessSnapshotAt: null
  });
  const [topicRetentionMetrics, setTopicRetentionMetrics] = useState([]);
  const [topicRetentionMetricsLoading, setTopicRetentionMetricsLoading] = useState(false);
  const [topicRetentionMetricsError, setTopicRetentionMetricsError] = useState(null);
  const [topicRetentionMetricsMeta, setTopicRetentionMetricsMeta] = useState({
    computedAt: null,
    fitnessSnapshotAt: null
  });
  const [graphNodes, setGraphNodes] = useState([]);
  const [graphEdges, setGraphEdges] = useState([]);
  const [graphLoading, setGraphLoading] = useState(false);
  const [graphError, setGraphError] = useState(null);
  const [graphTransform, setGraphTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isGraphPanning, setIsGraphPanning] = useState(false);
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
  const [activeRetentionTab, setActiveRetentionTab] = useState('challenge');
  const [gradePopoverAnchorEl, setGradePopoverAnchorEl] = useState(null);
  const [gradePopoverInfo, setGradePopoverInfo] = useState(null);
  const gradePopoverCloseTimeoutRef = useRef(null);
  const graphContainerRef = useRef(null);
  const graphPanRef = useRef({
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0
  });

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

  function resetGraphTransform() {
    setGraphTransform({ scale: 1, x: 0, y: 0 });
  }

  function applyGraphScale(scaleUpdater, anchorX, anchorY) {
    setGraphTransform((prev) => {
      const nextScale = typeof scaleUpdater === 'function'
        ? scaleUpdater(prev.scale)
        : scaleUpdater;
      const clamped = clampValue(nextScale, GRAPH_SCALE_LIMITS.min, GRAPH_SCALE_LIMITS.max);
      const scaleFactor = clamped / prev.scale;
      const nextX = anchorX - scaleFactor * (anchorX - prev.x);
      const nextY = anchorY - scaleFactor * (anchorY - prev.y);
      return {
        scale: clamped,
        x: nextX,
        y: nextY
      };
    });
  }

  function handleGraphMouseDown(event) {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    graphPanRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: graphTransform.x,
      originY: graphTransform.y
    };
    setIsGraphPanning(true);
  }

  function handleGraphWheel(event) {
    const container = graphContainerRef.current;
    if (!container) {
      return;
    }
    event.preventDefault();
    const rect = container.getBoundingClientRect();
    const anchorX = event.clientX - rect.left;
    const anchorY = event.clientY - rect.top;
    const zoom = event.deltaY < 0 ? 1.1 : 0.9;
    applyGraphScale((scale) => scale * zoom, anchorX, anchorY);
  }

  function handleGraphZoom(step) {
    const container = graphContainerRef.current;
    const anchorX = container ? container.clientWidth / 2 : 0;
    const anchorY = container ? container.clientHeight / 2 : 0;
    applyGraphScale((scale) => scale + step, anchorX, anchorY);
  }

  function handleGraphReset() {
    resetGraphTransform();
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

  async function loadRetentionMetrics({ language, refresh = true } = {}) {
    const normalizedLanguage = language || selectedLanguage;
    setRetentionMetricsLoading(true);
    setRetentionMetricsError(null);
    try {
      const params = new URLSearchParams({
        language: normalizedLanguage,
        refresh: refresh ? '1' : '0'
      });
      const response = await fetch(`/api/retention-metrics?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to load retention metrics.');
      }
      const data = await response.json();
      setRetentionMetrics(Array.isArray(data.metrics) ? data.metrics : []);
      setRetentionMetricsMeta({
        computedAt: data.computedAt ?? null,
        fitnessSnapshotAt: data.fitnessSnapshotAt ?? null
      });
    } catch (loadError) {
      setRetentionMetrics([]);
      setRetentionMetricsMeta({ computedAt: null, fitnessSnapshotAt: null });
      setRetentionMetricsError(loadError.message || 'Failed to load retention metrics.');
    } finally {
      setRetentionMetricsLoading(false);
    }
  }

  async function loadTopicRetentionMetrics({ language } = {}) {
    const normalizedLanguage = language || selectedLanguage;
    setTopicRetentionMetricsLoading(true);
    setTopicRetentionMetricsError(null);
    try {
      const params = new URLSearchParams({
        language: normalizedLanguage
      });
      const response = await fetch(`/api/retention-metrics/topics?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to load topic retention metrics.');
      }
      const data = await response.json();
      setTopicRetentionMetrics(Array.isArray(data.metrics) ? data.metrics : []);
      setTopicRetentionMetricsMeta({
        computedAt: data.computedAt ?? null,
        fitnessSnapshotAt: data.fitnessSnapshotAt ?? null
      });
    } catch (loadError) {
      setTopicRetentionMetrics([]);
      setTopicRetentionMetricsMeta({ computedAt: null, fitnessSnapshotAt: null });
      setTopicRetentionMetricsError(loadError.message || 'Failed to load topic retention metrics.');
    } finally {
      setTopicRetentionMetricsLoading(false);
    }
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

  function handleRetentionTabChange(nextTab) {
    if (nextTab === activeRetentionTab) {
      return;
    }
    setActiveRetentionTab(nextTab);
  }

  function handleRetentionRefresh() {
    if (activeRetentionTab === 'topic') {
      void loadTopicRetentionMetrics({ language: selectedLanguage });
    } else {
      void loadRetentionMetrics({ language: selectedLanguage, refresh: true });
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

  async function fetchChallengeGraph({ language } = {}) {
    const params = new URLSearchParams({
      language: normalizeLanguage(language || selectedLanguage),
      scope: 'submitted',
      edges: 'prerequisite'
    });
    const response = await fetch(`/api/challenges/graph?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to load challenge graph');
    }
    return response.json();
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
    let isMounted = true;

    async function refreshRetentionMetrics() {
      if (!isMounted) {
        return;
      }
      await Promise.all([
        loadRetentionMetrics({ language: selectedLanguage, refresh: true }),
        loadTopicRetentionMetrics({ language: selectedLanguage })
      ]);
    }

    refreshRetentionMetrics();

    return () => {
      isMounted = false;
    };
  }, [selectedLanguage]);

  useEffect(() => {
    let isMounted = true;

    async function loadGraph() {
      setGraphLoading(true);
      setGraphError(null);
      try {
        const data = await fetchChallengeGraph({ language: selectedLanguage });
        if (!isMounted) {
          return;
        }
        setGraphNodes(Array.isArray(data.nodes) ? data.nodes : []);
        setGraphEdges(Array.isArray(data.edges) ? data.edges : []);
        resetGraphTransform();
      } catch (loadError) {
        if (isMounted) {
          setGraphNodes([]);
          setGraphEdges([]);
          setGraphError(loadError.message || 'Failed to load challenge graph.');
        }
      } finally {
        if (isMounted) {
          setGraphLoading(false);
        }
      }
    }

    loadGraph();

    return () => {
      isMounted = false;
    };
  }, [selectedLanguage]);

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

  useEffect(() => {
    if (!isGraphPanning) {
      return undefined;
    }

    function handleMouseMove(event) {
      const { startX, startY, originX, originY } = graphPanRef.current;
      setGraphTransform((prev) => ({
        ...prev,
        x: originX + (event.clientX - startX),
        y: originY + (event.clientY - startY)
      }));
    }

    function handleMouseUp() {
      setIsGraphPanning(false);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isGraphPanning]);

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
  const retentionMeta = activeRetentionTab === 'topic'
    ? topicRetentionMetricsMeta
    : retentionMetricsMeta;
  const retentionMetricsComputedAt = retentionMeta?.computedAt;
  const retentionMetricsSnapshotAt = retentionMeta?.fitnessSnapshotAt;
  const retentionMetricsMetaLabel = [
    retentionMetricsComputedAt ? `Computed: ${formatDate(retentionMetricsComputedAt)}` : null,
    retentionMetricsSnapshotAt ? `Fitness snapshot: ${formatDate(retentionMetricsSnapshotAt)}` : null
  ].filter(Boolean).join(' • ');
  const challengeRetentionRows = retentionMetrics.map((metric) => {
    const challengeId = metric.challenge_id || metric.challengeId || metric.challenge;
    const challenge = challengeId ? challengeMap[challengeId] : null;
    const title = challenge?.name || metric.challenge_name || challengeId || 'Unknown';
    const difficultyValue = metric.difficulty || challenge?.difficulty || UNKNOWN_DIFFICULTY;
    const difficultyLabel = normalizeDifficultyLevel(difficultyValue)
      ? formatDifficultyLabel(difficultyValue)
      : difficultyValue;
    const topics = extractTopics(metric.topics || challenge?.topics);
    const topicLabel = topics.length > 0 ? topics.join(', ') : '—';

    return {
      key: `${challengeId || title}-${metric.language || selectedLanguage}`,
      title,
      difficulty: difficultyLabel,
      topics: topicLabel,
      submissions: formatCount(metric.submission_count),
      lastSubmission: metric.last_submission_at,
      guidanceScore: formatScore(metric.guidance_score),
      attemptScore: formatScore(metric.attempt_score),
      timeScore: formatScore(metric.time_score),
      masteryScore: formatScore(metric.mastery_score),
      recencyDays: formatScore(metric.recency_days, 1),
      recencyScore: formatScore(metric.recency_score),
      weaknessScore: formatScore(metric.weakness_score),
      priorityScore: formatScore(metric.priority_score)
    };
  });
  const topicRetentionRows = topicRetentionMetrics.map((metric) => {
    const topicLabel = metric.topic || 'Unknown';
    const difficultyValue = metric.difficulty || UNKNOWN_DIFFICULTY;
    const difficultyLabel = normalizeDifficultyLevel(difficultyValue)
      ? formatDifficultyLabel(difficultyValue)
      : difficultyValue;

    return {
      key: `${topicLabel}-${difficultyLabel}-${metric.language || selectedLanguage}`,
      topic: topicLabel,
      difficulty: difficultyLabel,
      submissions: formatCount(metric.submission_count),
      lastSubmission: metric.last_submission_at,
      guidanceScore: formatScore(metric.guidance_score),
      attemptScore: formatScore(metric.attempt_score),
      timeScore: formatScore(metric.time_score),
      masteryScore: formatScore(metric.mastery_score),
      recencyDays: formatScore(metric.recency_days, 1),
      recencyScore: formatScore(metric.recency_score),
      weaknessScore: formatScore(metric.weakness_score),
      priorityScore: formatScore(metric.priority_score)
    };
  });
  const activeRetentionRows = activeRetentionTab === 'topic'
    ? topicRetentionRows
    : challengeRetentionRows;
  const activeRetentionLoading = activeRetentionTab === 'topic'
    ? topicRetentionMetricsLoading
    : retentionMetricsLoading;
  const activeRetentionError = activeRetentionTab === 'topic'
    ? topicRetentionMetricsError
    : retentionMetricsError;
  const activeRetentionLoadingLabel = activeRetentionTab === 'topic'
    ? 'Loading topic retention metrics...'
    : 'Loading retention metrics...';
  const activeRetentionEmptyLabel = activeRetentionTab === 'topic'
    ? 'No topic retention metrics available yet.'
    : 'No retention metrics available yet.';
  const graphLayout = buildGraphLayout(graphNodes, graphEdges);
  const graphHasData = graphNodes.length > 0;
  const graphMetaLabel = graphHasData
    ? `${graphNodes.length} challenges · ${graphEdges.length} edges`
    : 'No graph data yet.';

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
        <section className="retention-metrics-panel">
          <div className="retention-metrics-header">
            <div className="retention-metrics-header-main">
              <div className="retention-metrics-header-text">
                <h2>Retention Metrics</h2>
                <p>Raw scoring data used for review scheduling</p>
                {retentionMetricsMetaLabel && (
                  <div className="retention-metrics-meta">{retentionMetricsMetaLabel}</div>
                )}
              </div>
              <Tabs
                className="retention-metrics-tabs"
                value={activeRetentionTab}
                onChange={(event, newValue) => handleRetentionTabChange(newValue)}
                aria-label="Retention metrics views"
                TabIndicatorProps={{ style: { display: 'none' } }}
              >
                <Tab
                  id="retention-metrics-tab-challenge"
                  aria-controls="retention-metrics-panel"
                  className={`retention-metrics-tab${activeRetentionTab === 'challenge' ? ' is-active' : ''}`}
                  label="By Challenge"
                  value="challenge"
                />
                <Tab
                  id="retention-metrics-tab-topic"
                  aria-controls="retention-metrics-panel"
                  className={`retention-metrics-tab${activeRetentionTab === 'topic' ? ' is-active' : ''}`}
                  label="By Topic (Codex Approach)"
                  value="topic"
                />
              </Tabs>
            </div>
            <Button
              className="btn btn--outline btn--xs retention-metrics-refresh"
              type="button"
              onClick={handleRetentionRefresh}
              disabled={activeRetentionLoading}
            >
              {activeRetentionLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          <div className="retention-metrics-body">
            {activeRetentionLoading && (
              <div className="retention-metrics-status">
                <span className="spinner" aria-hidden="true" />
                <span>{activeRetentionLoadingLabel}</span>
              </div>
            )}
            {!activeRetentionLoading && activeRetentionError && (
              <div className="retention-metrics-error">{activeRetentionError}</div>
            )}
            {!activeRetentionLoading && !activeRetentionError && activeRetentionRows.length === 0 && (
              <div className="retention-metrics-status">{activeRetentionEmptyLabel}</div>
            )}
            {!activeRetentionLoading && !activeRetentionError && activeRetentionRows.length > 0 && (
              <TableContainer className="retention-metrics-table-wrapper">
                <Table className="retention-metrics-table" size="small">
                  <TableHead>
                    <TableRow>
                      {activeRetentionTab === 'topic' ? (
                        <>
                          <TableCell>Topic</TableCell>
                          <TableCell>Difficulty</TableCell>
                          <TableCell>Submissions</TableCell>
                          <TableCell>Last Submission</TableCell>
                          <TableCell>Guidance</TableCell>
                          <TableCell>Attempts</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Mastery</TableCell>
                          <TableCell>Recency (days)</TableCell>
                          <TableCell>Recency</TableCell>
                          <TableCell>Weakness</TableCell>
                          <TableCell>Priority</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>Challenge</TableCell>
                          <TableCell>Difficulty</TableCell>
                          <TableCell>Topics</TableCell>
                          <TableCell>Submissions</TableCell>
                          <TableCell>Last Submission</TableCell>
                          <TableCell>Guidance</TableCell>
                          <TableCell>Attempts</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Mastery</TableCell>
                          <TableCell>Recency (days)</TableCell>
                          <TableCell>Recency</TableCell>
                          <TableCell>Weakness</TableCell>
                          <TableCell>Priority</TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeRetentionTab === 'topic'
                      ? topicRetentionRows.map((row) => (
                        <TableRow key={row.key}>
                          <TableCell>{row.topic}</TableCell>
                          <TableCell>{row.difficulty}</TableCell>
                          <TableCell>{row.submissions}</TableCell>
                          <TableCell>{formatDate(row.lastSubmission)}</TableCell>
                          <TableCell>{row.guidanceScore}</TableCell>
                          <TableCell>{row.attemptScore}</TableCell>
                          <TableCell>{row.timeScore}</TableCell>
                          <TableCell>{row.masteryScore}</TableCell>
                          <TableCell>{row.recencyDays}</TableCell>
                          <TableCell>{row.recencyScore}</TableCell>
                          <TableCell>{row.weaknessScore}</TableCell>
                          <TableCell>{row.priorityScore}</TableCell>
                        </TableRow>
                      ))
                      : challengeRetentionRows.map((row) => (
                        <TableRow key={row.key}>
                          <TableCell>{row.title}</TableCell>
                          <TableCell>{row.difficulty}</TableCell>
                          <TableCell>{row.topics}</TableCell>
                          <TableCell>{row.submissions}</TableCell>
                          <TableCell>{formatDate(row.lastSubmission)}</TableCell>
                          <TableCell>{row.guidanceScore}</TableCell>
                          <TableCell>{row.attemptScore}</TableCell>
                          <TableCell>{row.timeScore}</TableCell>
                          <TableCell>{row.masteryScore}</TableCell>
                          <TableCell>{row.recencyDays}</TableCell>
                          <TableCell>{row.recencyScore}</TableCell>
                          <TableCell>{row.weaknessScore}</TableCell>
                          <TableCell>{row.priorityScore}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </section>
        <section className="challenge-graph-panel">
          <div className="challenge-graph-header">
            <div>
              <h2>Challenge Graph</h2>
              <p>Prerequisite map for submitted challenges</p>
            </div>
            <div className="challenge-graph-controls">
              <div className="challenge-graph-meta">{graphMetaLabel}</div>
              <Button
                className="btn btn--outline btn--xs"
                type="button"
                onClick={() => handleGraphZoom(-0.2)}
                disabled={!graphHasData}
              >
                Zoom out
              </Button>
              <Button
                className="btn btn--outline btn--xs"
                type="button"
                onClick={() => handleGraphZoom(0.2)}
                disabled={!graphHasData}
              >
                Zoom in
              </Button>
              <Button
                className="btn btn--outline btn--xs"
                type="button"
                onClick={handleGraphReset}
                disabled={!graphHasData}
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="challenge-graph-body">
            {graphLoading && (
              <div className="challenge-graph-status">Loading graph...</div>
            )}
            {!graphLoading && graphError && (
              <div className="challenge-graph-error">{graphError}</div>
            )}
            {!graphLoading && !graphError && !graphHasData && (
              <div className="challenge-graph-status">No graph data yet.</div>
            )}
            {!graphLoading && !graphError && graphHasData && (
              <div
                className={`challenge-graph-canvas${isGraphPanning ? ' is-panning' : ''}`}
                ref={graphContainerRef}
                onWheel={handleGraphWheel}
                onMouseDown={handleGraphMouseDown}
                role="img"
                aria-label="Challenge prerequisite graph"
              >
                <svg
                  className="challenge-graph-svg"
                  width={graphLayout.width}
                  height={graphLayout.height}
                  aria-hidden="true"
                >
                  <g
                    transform={`translate(${graphTransform.x} ${graphTransform.y}) scale(${graphTransform.scale})`}
                  >
                    <g className="challenge-graph-columns">
                      {graphLayout.columnLabels.map((column) => (
                        <text
                          key={column.key}
                          x={column.x}
                          y={column.y}
                          className="challenge-graph-column-label"
                        >
                          {column.label}
                        </text>
                      ))}
                    </g>
                    <g className="challenge-graph-edges">
                      {graphLayout.edges.map((edge) => {
                        const from = graphLayout.positions.get(edge.from);
                        const to = graphLayout.positions.get(edge.to);
                        if (!from || !to) {
                          return null;
                        }
                        return (
                          <path
                            key={`${edge.from}-${edge.to}`}
                            d={buildGraphEdgePath(from, to)}
                            className="challenge-graph-edge"
                          />
                        );
                      })}
                    </g>
                    <g className="challenge-graph-nodes">
                      {graphLayout.nodes.map((node) => {
                        const position = graphLayout.positions.get(node.id);
                        if (!position) {
                          return null;
                        }
                        const nodeClassName = [
                          'challenge-graph-node',
                          node.hasSubmission ? 'is-submitted' : 'is-ancestor',
                          `difficulty-${node.difficulty}`
                        ].join(' ');
                        return (
                          <g key={node.id} className={nodeClassName}>
                            <circle
                              cx={position.x}
                              cy={position.y}
                              r={GRAPH_NODE_RADIUS}
                            />
                            <text
                              x={position.x + GRAPH_NODE_RADIUS + 10}
                              y={position.y + 4}
                              className="challenge-graph-label"
                            >
                              {node.name}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  </g>
                </svg>
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
