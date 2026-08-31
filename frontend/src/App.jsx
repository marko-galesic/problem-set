import React, { useState, useEffect, useRef } from 'react';
import { IconButton } from '@mui/material';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import TestResults from './components/TestResults';
import TestCasesPreview from './components/TestCasesPreview';
import DescriptionPanel from './components/DescriptionPanel';
import ResizableDivider from './components/ResizableDivider';
import { saveImplementation, getDividerPosition, saveDividerPosition, getEditorMaximized, saveEditorMaximized, getVerticalDividerPosition, saveVerticalDividerPosition, saveCurrentCode, getCurrentCode, saveSubmission, getSubmissions, deleteSubmission, updateSubmission, saveTimerState, getTimerState, incrementSubmitAttempts, resetSubmitAttempts, getLanguagePreference, saveLanguagePreference } from './utils/storage';
import SubmissionsSidebar from './components/SubmissionsSidebar';
import SubmissionMetadataPopover from './components/SubmissionMetadataPopover';
import BugAnswerPopover from './components/BugAnswerPopover';
import GuideConfirmPopover from './components/GuideConfirmPopover';
import GuideChatPopover from './components/GuideChatPopover';
import NextChallengePopover from './components/NextChallengePopover';
import ProgressReportPopover from './components/ProgressReportPopover';
import InterviewerNotesPopover from './components/InterviewerNotesPopover';

const DEFAULT_CODE = {
  java: `class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        return null;
    }
}`,
  python: `class TwoSum:
    def twoSum(self, nums, target):
        return None
`,
  javascript: `class TwoSum {
  twoSum(nums, target) {
    return null;
  }
}`,
  typescript: `class TwoSum {
  twoSum(nums, target) {
    return null;
  }
}`,
  cpp: `#include <vector>

class TwoSum {
public:
  std::vector<int> twoSum(std::vector<int>& nums, int target) {
    return {};
  }
};`
};

const UNTRACKED_TIMER_VALUE = -1;
const PROGRESS_REPORT_CACHE_KEY = 'daily_progress_report_v1';

function getInitialChallengeId() {
  if (typeof window === 'undefined') {
    return 'two_sum';
  }
  const params = new URLSearchParams(window.location.search);
  const candidate = params.get('challenge');
  return candidate || 'two_sum';
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseSubmissionDate(value) {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

function isSameLocalDay(value, referenceDate = new Date()) {
  const parsed = parseSubmissionDate(value);
  if (!parsed) {
    return false;
  }
  return (
    parsed.getFullYear() === referenceDate.getFullYear() &&
    parsed.getMonth() === referenceDate.getMonth() &&
    parsed.getDate() === referenceDate.getDate()
  );
}

function getProgressReportCache() {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  const raw = localStorage.getItem(PROGRESS_REPORT_CACHE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function saveProgressReportCache(entry) {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(PROGRESS_REPORT_CACHE_KEY, JSON.stringify(entry));
}

function clearProgressReportCache() {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.removeItem(PROGRESS_REPORT_CACHE_KEY);
}

function buildProgressSignature(submissions) {
  if (!Array.isArray(submissions) || submissions.length === 0) {
    return '';
  }
  const timestamps = submissions
    .map((submission) => Date.parse(submission?.date))
    .filter((value) => Number.isFinite(value));
  const latestTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : Date.now();
  return `${submissions.length}:${latestTimestamp}`;
}

function App() {
  const [currentChallenge, setCurrentChallenge] = useState(getInitialChallengeId);
  const [challenges, setChallenges] = useState([]);
  const [description, setDescription] = useState('');
  const [code, setCode] = useState(DEFAULT_CODE.java);
  const [currentLanguage, setCurrentLanguage] = useState('java');
  const [languageReady, setLanguageReady] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [runningAction, setRunningAction] = useState(null); // 'run', 'submit', or null
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dividerPosition, setDividerPosition] = useState(16.67);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [isTestCasesMinimized, setIsTestCasesMinimized] = useState(false);
  const [isTestSectionExpanded, setIsTestSectionExpanded] = useState(true);
  const [testCases, setTestCases] = useState({ runTests: [], submitTests: [] });
  const [extraRunTestIds, setExtraRunTestIds] = useState([]);
  const [currentActionType, setCurrentActionType] = useState(null);
  const [verticalDividerPosition, setVerticalDividerPosition] = useState(40);
  const timerRef = useRef(null);
  const languageLoadRef = useRef(0);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [canSave, setCanSave] = useState(false);
  const [savedTimerTime, setSavedTimerTime] = useState(null);
  const [timerInitialState, setTimerInitialState] = useState({ elapsedTime: 0, isRunning: false, accumulatedTime: 0 });
  const [isSubmissionMetadataOpen, setIsSubmissionMetadataOpen] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(null);
  const [isBugPopoverOpen, setIsBugPopoverOpen] = useState(false);
  const [bugAnswer, setBugAnswer] = useState('');
  const [bugError, setBugError] = useState('');
  const [isBugLoading, setIsBugLoading] = useState(false);
  const [bugHintUsed, setBugHintUsed] = useState(false);
  const [bugHintEvaluation, setBugHintEvaluation] = useState(null);
  const [isGuideConfirmOpen, setIsGuideConfirmOpen] = useState(false);
  const [isGuideChatOpen, setIsGuideChatOpen] = useState(false);
  const [guideMessages, setGuideMessages] = useState([]);
  const [guideInput, setGuideInput] = useState('');
  const [guideError, setGuideError] = useState('');
  const [isGuideLoading, setIsGuideLoading] = useState(false);
  const [guideUsed, setGuideUsed] = useState(false);
  const [guidanceDisabledOptions, setGuidanceDisabledOptions] = useState([]);
  const [isNextChallengeOpen, setIsNextChallengeOpen] = useState(false);
  const [nextChallengeLoading, setNextChallengeLoading] = useState(false);
  const [nextChallengeError, setNextChallengeError] = useState(null);
  const [nextChallengeRecommendation, setNextChallengeRecommendation] = useState(null);
  const [nextChallengeId, setNextChallengeId] = useState(null);
  const [nextChallengeCountdown, setNextChallengeCountdown] = useState(5);
  const nextChallengeCountdownRef = useRef(null);
  const nextChallengeBootstrapRef = useRef(false);
  const [isProgressPopoverOpen, setIsProgressPopoverOpen] = useState(false);
  const [isProgressReportLoading, setIsProgressReportLoading] = useState(false);
  const [progressReportError, setProgressReportError] = useState('');
  const [progressReport, setProgressReport] = useState('');
  const [progressEligible, setProgressEligible] = useState(false);
  const [progressSubmissionCount, setProgressSubmissionCount] = useState(0);
  const progressCheckTimeoutRef = useRef(null);
  const [interviewerModeEnabled, setInterviewerModeEnabled] = useState(false);
  const [isInterviewerConfirmOpen, setIsInterviewerConfirmOpen] = useState(false);
  const [isInterviewerNotesOpen, setIsInterviewerNotesOpen] = useState(false);
  const [interviewerNotes, setInterviewerNotes] = useState('');
  const [interviewerNotesError, setInterviewerNotesError] = useState('');
  const [isInterviewerNotesLoading, setIsInterviewerNotesLoading] = useState(false);
  const interviewerNotesRequestRef = useRef(0);

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
    if (normalized === 'cpp' || normalized === 'c++') {
      return 'cpp';
    }
    return 'java';
  }

  function buildProgressPayload(submissions) {
    return (submissions || []).map((submission) => ({
      challenge: submission.challenge ?? submission.challengeId ?? '',
      challengeName: submission.challengeName ?? '',
      language: normalizeLanguage(submission.language),
      avgTime: submission.avgTime ?? null,
      timerTime: submission.timerTime ?? null,
      submitAttempts: submission.submitAttempts ?? null,
      guidanceLevel: submission.guidanceLevel ?? 'Independent',
      techBarStatus: submission.techBarStatus ?? 'pending',
      techBarLabel: submission.techBarLabel ?? null,
      date: submission.date ?? null
    }));
  }

  function getLocalDayRange(date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return { from: start.toISOString(), to: end.toISOString() };
  }

  function getRecentDateRange(days) {
    const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return { from: fromDate.toISOString() };
  }

  function findChallengeByName(name, list) {
    if (!name) {
      return null;
    }
    const normalized = String(name).trim().toLowerCase();
    if (!normalized) {
      return null;
    }
    return (list || []).find(
      (challenge) => String(challenge?.name || '').trim().toLowerCase() === normalized
    ) || null;
  }

  async function loadAllSubmissions({ from, to, language } = {}) {
    const submissions = [];
    let page = 1;
    const limit = 200;
    let hasMore = true;
    const challengeNameMap = Array.isArray(challenges)
      ? new Map(challenges.map((challenge) => [challenge.id, challenge.name]))
      : new Map();

    try {
      while (hasMore) {
        const params = new URLSearchParams({
          scope: 'all',
          page: String(page),
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
        const data = await response.json();
        const batch = Array.isArray(data.submissions) ? data.submissions : [];
        submissions.push(...batch);
        hasMore = Boolean(data.hasMore);
        page += 1;
        if (page > 2000) {
          hasMore = false;
        }
      }
    } catch (error) {
      return [];
    }

    return submissions.map((submission) => ({
      ...submission,
      challengeName: submission.challengeName ?? challengeNameMap.get(submission.challenge)
    }));
  }

  async function prepareProgressReport(submissions, signature, dateKey) {
    if (!Array.isArray(submissions) || submissions.length === 0 || isProgressReportLoading) {
      return;
    }
    setIsProgressReportLoading(true);
    setProgressReportError('');
    try {
      const response = await fetch('/api/progress-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateKey,
          submissions: buildProgressPayload(submissions)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate progress report');
      }

      const data = await response.json();
      const reportText = typeof data.report === 'string' ? data.report.trim() : '';
      if (!reportText) {
        throw new Error('No report returned.');
      }

      setProgressReport(reportText);
      saveProgressReportCache({
        dateKey,
        signature,
        report: reportText,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      setProgressReportError(error.message || 'Failed to generate progress report.');
    } finally {
      setIsProgressReportLoading(false);
    }
  }

  async function refreshProgressEligibility({ autoPrepare = false } = {}) {
    const now = new Date();
    const isAfterFour = now.getHours() >= 16;
    if (!isAfterFour) {
      setProgressEligible(false);
      setProgressSubmissionCount(0);
      setProgressReport('');
      setProgressReportError('');
      return { eligible: false, submissions: [], signature: '', dateKey: getLocalDateKey(now) };
    }

    const { from, to } = getLocalDayRange(now);
    const allSubmissions = await loadAllSubmissions({ from, to });
    const todaysSubmissions = allSubmissions.filter((submission) => isSameLocalDay(submission?.date, now));
    const signature = buildProgressSignature(todaysSubmissions);
    const dateKey = getLocalDateKey(now);
    const eligible = todaysSubmissions.length > 0;
    setProgressEligible(eligible);
    setProgressSubmissionCount(todaysSubmissions.length);

    const cached = getProgressReportCache();
    if (cached && cached.dateKey !== dateKey) {
      clearProgressReportCache();
      setProgressReport('');
    }

    if (eligible && cached && cached.dateKey === dateKey && cached.signature === signature && cached.report) {
      setProgressReport(cached.report);
      setProgressReportError('');
      return { eligible, submissions: todaysSubmissions, signature, dateKey, usedCache: true };
    }

    if (!eligible) {
      setProgressReport('');
      setProgressReportError('');
      return { eligible, submissions: todaysSubmissions, signature, dateKey };
    }

    if (autoPrepare) {
      setProgressReport('');
      await prepareProgressReport(todaysSubmissions, signature, dateKey);
    }

    return { eligible, submissions: todaysSubmissions, signature, dateKey };
  }

  function handleProgressOpen() {
    setProgressReportError('');
    setIsProgressPopoverOpen(true);
    void refreshProgressEligibility({ autoPrepare: true });
  }

  function handleInterviewerNotesRequest() {
    if (interviewerModeEnabled) {
      setIsInterviewerNotesOpen(true);
      return;
    }
    setIsInterviewerConfirmOpen(true);
  }

  async function handleInterviewerNotesConfirm() {
    const requestId = ++interviewerNotesRequestRef.current;
    const requestedChallenge = currentChallenge;
    setInterviewerModeEnabled(true);
    setIsInterviewerConfirmOpen(false);
    setIsInterviewerNotesOpen(true);
    setIsInterviewerNotesLoading(true);
    setInterviewerNotes('');
    setInterviewerNotesError('');

    try {
      const response = await fetch(`/api/interviewer-notes?challenge=${requestedChallenge}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(response.status === 404
          ? 'Interviewer notes are not available for this challenge.'
          : 'Failed to load interviewer notes.');
      }
      if (requestId !== interviewerNotesRequestRef.current) {
        return;
      }
      setInterviewerNotes(data.notes || '');
    } catch (error) {
      if (requestId !== interviewerNotesRequestRef.current) {
        return;
      }
      setInterviewerNotesError(error.message || 'Failed to load interviewer notes.');
    } finally {
      if (requestId === interviewerNotesRequestRef.current) {
        setIsInterviewerNotesLoading(false);
      }
    }
  }

  useEffect(() => {
    interviewerNotesRequestRef.current += 1;
    setInterviewerModeEnabled(false);
    setIsInterviewerConfirmOpen(false);
    setIsInterviewerNotesOpen(false);
    setInterviewerNotes('');
    setInterviewerNotesError('');
    setIsInterviewerNotesLoading(false);
  }, [currentChallenge]);

  // Fetch challenges on mount
  useEffect(() => {
    async function fetchChallenges() {
      try {
        const response = await fetch('/api/challenges');
        const data = await response.json();
        setChallenges(data.challenges || []);
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
      }
    }
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (!challenges || challenges.length === 0) {
      return;
    }
    const exists = challenges.some((challenge) => challenge.id === currentChallenge);
    if (!exists) {
      setCurrentChallenge(challenges[0].id);
    }
  }, [challenges, currentChallenge]);

  useEffect(() => {
    const challenge = challenges.find((entry) => entry.id === currentChallenge);
    const supportedLanguages = challenge?.languages || ['java', 'python', 'javascript', 'typescript'];
    if (!supportedLanguages.includes(currentLanguage)) {
      handleLanguageChange('java');
    }
  }, [challenges, currentChallenge, currentLanguage]);

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
        languages: challenge.languages
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
        difficulty: null,
        languages: challenge.languages
      }));
    }
  }

  useEffect(() => {
    let isActive = true;
    const requestId = ++languageLoadRef.current;

    async function loadLanguagePreference() {
      const savedLanguage = await getLanguagePreference();
      if (!isActive || requestId !== languageLoadRef.current) {
        return;
      }
      setCurrentLanguage(normalizeLanguage(savedLanguage || 'java'));
      setLanguageReady(true);
    }

    loadLanguagePreference();

    return () => {
      isActive = false;
    };
  }, [currentChallenge]);

  useEffect(() => {
    if (nextChallengeBootstrapRef.current || !languageReady || challenges.length === 0) {
      return;
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('challenge')) {
        nextChallengeBootstrapRef.current = true;
        return;
      }
    }

    nextChallengeBootstrapRef.current = true;
    let isActive = true;

    async function bootstrapRecommendedChallenge() {
      try {
        const metadata = await fetchChallengesMetadata();
        const eligibleMetadata = metadata.filter((challenge) => (
          !Array.isArray(challenge.languages) || challenge.languages.includes(currentLanguage)
        ));
        const { from } = getRecentDateRange(14);
        const recentSubmissions = await loadAllSubmissions({
          from,
          language: currentLanguage
        });
        const response = await fetch('/api/recommend-next-challenge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            submissions: recentSubmissions,
            challenges: eligibleMetadata
          })
        });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (!isActive) {
          return;
        }
        const matched = findChallengeByName(data.name, eligibleMetadata)
          || findChallengeByName(data.name, challenges);
        if (matched?.id && matched.id !== currentChallenge) {
          setCurrentChallenge(matched.id);
        }
      } catch (error) {
        console.warn('Failed to load recommended challenge:', error);
      }
    }

    bootstrapRecommendedChallenge();

    return () => {
      isActive = false;
    };
  }, [languageReady, challenges, currentLanguage, currentChallenge]);

  // Load challenge-specific data when challenge or language changes
  useEffect(() => {
    async function loadChallengeData() {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:loadChallengeData:start',message:'loadChallengeData start',data:{challenge:currentChallenge,language:currentLanguage},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      try {
        const savedDividerPos = getDividerPosition(currentChallenge);
        if (savedDividerPos !== null) {
          setDividerPosition(savedDividerPos);
        }
        const savedVerticalDividerPos = getVerticalDividerPosition(currentChallenge);
        if (savedVerticalDividerPos !== null) {
          setVerticalDividerPosition(savedVerticalDividerPos);
        }
        setIsEditorMaximized(getEditorMaximized(currentChallenge));

        const templateResponse = await fetch(`/api/template?challenge=${currentChallenge}&language=${currentLanguage}`);
        const templateData = await templateResponse.json();
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:loadChallengeData:template',message:'template response',data:{challenge:currentChallenge,language:currentLanguage,ok:templateResponse.ok,status:templateResponse.status,hasCode:Boolean(templateData && templateData.code)},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        const savedCode = getCurrentCode(currentChallenge, currentLanguage);
        if (savedCode) {
          setCode(savedCode);
        } else if (templateData.code) {
          setCode(templateData.code);
          saveCurrentCode(templateData.code, currentChallenge, currentLanguage);
        }

        const descResponse = await fetch(`/api/description?challenge=${currentChallenge}`);
        const descData = await descResponse.json();
        if (descData.description) {
          setDescription(descData.description);
        }

        const testResponse = await fetch(`/api/test-cases?challenge=${currentChallenge}&language=${currentLanguage}`);
        const testData = await testResponse.json();
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:loadChallengeData:testCases',message:'test cases response',data:{challenge:currentChallenge,language:currentLanguage,ok:testResponse.ok,status:testResponse.status,runCount:(testData.runTests||[]).length,submitCount:(testData.submitTests||[]).length},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        setTestCases({
          runTests: testData.runTests || [],
          submitTests: testData.submitTests || []
        });

        const loadedSubmissions = await getSubmissions(currentChallenge);
        setSubmissions(loadedSubmissions);

        const savedTimerState = getTimerState(currentChallenge, currentLanguage);
        if (savedTimerState) {
          setTimerInitialState(savedTimerState);
        } else {
          setTimerInitialState({ elapsedTime: 0, isRunning: false, accumulatedTime: 0 });
        }
      } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/21741705-9df2-4de5-9b0a-2a68c5e131e1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:loadChallengeData:error',message:'loadChallengeData error',data:{challenge:currentChallenge,language:currentLanguage,error:error ? String(error) : 'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        console.error('Failed to load challenge data:', error);
      }
    }
    loadChallengeData();
  }, [currentChallenge, currentLanguage]);

  useEffect(() => {
    if (progressCheckTimeoutRef.current) {
      clearTimeout(progressCheckTimeoutRef.current);
      progressCheckTimeoutRef.current = null;
    }

    const now = new Date();
    const isAfterFour = now.getHours() >= 16;

    if (!isAfterFour) {
      const target = new Date(now);
      target.setHours(16, 0, 0, 0);
      const delay = target.getTime() - now.getTime();
      if (delay > 0) {
        progressCheckTimeoutRef.current = setTimeout(() => {
          void refreshProgressEligibility({ autoPrepare: true });
        }, delay);
      }
    }

    void refreshProgressEligibility({ autoPrepare: true });

    return () => {
      if (progressCheckTimeoutRef.current) {
        clearTimeout(progressCheckTimeoutRef.current);
        progressCheckTimeoutRef.current = null;
      }
    };
  }, [challenges, submissions]);


  useEffect(() => {
    saveDividerPosition(dividerPosition, currentChallenge);
  }, [dividerPosition, currentChallenge]);

  useEffect(() => {
    saveVerticalDividerPosition(verticalDividerPosition, currentChallenge);
  }, [verticalDividerPosition, currentChallenge]);

  useEffect(() => {
    clearNextChallengeCountdown();
    if (!isNextChallengeOpen || nextChallengeLoading || nextChallengeError || !nextChallengeId) {
      return undefined;
    }

    let remaining = 5;
    setNextChallengeCountdown(remaining);
    nextChallengeCountdownRef.current = setInterval(() => {
      remaining -= 1;
      setNextChallengeCountdown(remaining);
      if (remaining <= 0) {
        clearNextChallengeCountdown();
        handleNextChallengeContinue();
      }
    }, 1000);

    return () => {
      clearNextChallengeCountdown();
    };
  }, [isNextChallengeOpen, nextChallengeLoading, nextChallengeError, nextChallengeId]);

  function handleDividerResize(newPosition) {
    setDividerPosition(newPosition);
  }

  function handleVerticalDividerResize(newPosition) {
    setVerticalDividerPosition(newPosition);
  }


  function handleToggleTestCasesMinimize() {
    setIsTestCasesMinimized(!isTestCasesMinimized);
  }

  function handleToggleMaximize() {
    const newMaximized = !isEditorMaximized;
    setIsEditorMaximized(newMaximized);
    saveEditorMaximized(newMaximized, currentChallenge);
  }

  function handleToggleDescription() {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  }

  function handleToggleTestSection() {
    setIsTestSectionExpanded(!isTestSectionExpanded);
  }

  function handleCodeChange(value) {
    setCode(value);
    saveCurrentCode(value, currentChallenge, currentLanguage);
  }

  function handleEditorTyping() {
    timerRef.current?.notifyTyping?.();
  }

  function handleTimerStateChange(elapsedTime, isRunning, accumulatedTime) {
    // Save timer state whenever it changes
    saveTimerState(currentChallenge, elapsedTime, isRunning, accumulatedTime, currentLanguage);
  }

  function handleChallengeChange(newChallenge) {
    // Save current code before switching
    saveCurrentCode(code, currentChallenge, currentLanguage);
    
    // Save current timer state before switching
    // The timer state should already be saved via onStateChange callback,
    // but we'll ensure it's saved here as well by getting the latest state
    if (timerRef.current) {
      const currentElapsedTime = timerRef.current.getElapsedTime();
      timerRef.current.stop();
      // Persist a paused snapshot to avoid leaking ticks into the next challenge.
      saveTimerState(currentChallenge, currentElapsedTime, false, currentElapsedTime, currentLanguage);
    }
    
    setCurrentChallenge(newChallenge);
    setTestResults(null);
    setCurrentActionType(null);
    setCanSave(false);
    setSavedTimerTime(null);
    setIsSidebarExpanded(false);
    setIsSubmissionMetadataOpen(false);
    setPendingSubmission(null);
    setBugHintUsed(false);
    setBugHintEvaluation(null);
    setGuideUsed(false);
    setGuideMessages([]);
    setGuideInput('');
    setGuideError('');
    setIsGuideLoading(false);
    setIsGuideChatOpen(false);
    setIsGuideConfirmOpen(false);
    setGuidanceDisabledOptions([]);
    setExtraRunTestIds([]);
  }

  function clearNextChallengeCountdown() {
    if (nextChallengeCountdownRef.current) {
      clearInterval(nextChallengeCountdownRef.current);
      nextChallengeCountdownRef.current = null;
    }
  }

  function handleNextChallengeClose() {
    clearNextChallengeCountdown();
    setIsNextChallengeOpen(false);
  }

  function handleNextChallengeContinue() {
    clearNextChallengeCountdown();
    setIsNextChallengeOpen(false);
    if (nextChallengeId) {
      handleChallengeChange(nextChallengeId);
    }
  }

  function handleLanguageChange(newLanguage) {
    languageLoadRef.current += 1;
    saveCurrentCode(code, currentChallenge, currentLanguage);
    if (timerRef.current) {
      const currentElapsedTime = timerRef.current.getElapsedTime();
      timerRef.current.stop();
      // Persist a paused snapshot before switching languages.
      saveTimerState(currentChallenge, currentElapsedTime, false, currentElapsedTime, currentLanguage);
    }
    const savedTimerState = getTimerState(currentChallenge, newLanguage);
    if (savedTimerState) {
      setTimerInitialState(savedTimerState);
    } else {
      setTimerInitialState({ elapsedTime: 0, isRunning: false, accumulatedTime: 0 });
    }
    void saveLanguagePreference(newLanguage);
    setCurrentLanguage(newLanguage);
    setTestResults(null);
    setCurrentActionType(null);
  }

  async function handleResetSolution() {
    try {
      setExtraRunTestIds([]);

      // First, cleanup the challenge-specific temp directory
      try {
        await fetch(`/api/cleanup?challenge=${currentChallenge}`, {
          method: 'DELETE'
        });
      } catch (cleanupError) {
        // Log but don't fail if cleanup fails
        console.warn('Failed to cleanup temp directory:', cleanupError);
      }
      
      // Then fetch and set the template code
      const response = await fetch(`/api/template?challenge=${currentChallenge}&language=${currentLanguage}`);
      const data = await response.json();
      if (data.code) {
        setCode(data.code);
        saveCurrentCode(data.code, currentChallenge, currentLanguage);
      } else {
        // Fallback to DEFAULT_CODE if template fetch fails
        console.error('Template response missing code field');
        setCode(DEFAULT_CODE[currentLanguage] || DEFAULT_CODE.java);
        saveCurrentCode(DEFAULT_CODE[currentLanguage] || DEFAULT_CODE.java, currentChallenge, currentLanguage);
      }
    } catch (error) {
      console.error('Failed to fetch template:', error);
      // Fallback to DEFAULT_CODE on error
      setCode(DEFAULT_CODE[currentLanguage] || DEFAULT_CODE.java);
      saveCurrentCode(DEFAULT_CODE[currentLanguage] || DEFAULT_CODE.java, currentChallenge, currentLanguage);
    }
  }

  function handleResetTimer() {
    timerRef.current?.reset();
    saveTimerState(currentChallenge, 0, false, 0, currentLanguage);
    setTimerInitialState({ elapsedTime: 0, isRunning: false, accumulatedTime: 0 });
  }

  async function handleRun() {
    setCurrentActionType('run');
    setRunningAction('run');
    setTestResults(null);

    try {
      // Get IDs of visible test cases (first 3)
      const visibleTestIds = testCases.runTests.slice(0, 3).map(test => test.id);
      const selectedTestIds = [...visibleTestIds];
      extraRunTestIds.forEach((testId) => {
        if (!selectedTestIds.includes(testId)) {
          selectedTestIds.push(testId);
        }
      });
      
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, testIds: selectedTestIds, challenge: currentChallenge, language: currentLanguage })
      });

      const data = await response.json();
      setTestResults({
        results: data.results || [],
        totalTime: data.totalTime,
        error: data.error
      });
    } catch (error) {
      setTestResults({
        results: [],
        error: error.message || 'Failed to execute code'
      });
    } finally {
      setRunningAction(null);
    }
  }

  async function saveSubmissionAndRefresh({ challengeId, avgTime, timerTime, solution, guidanceLevel, submitAttempts, language }) {
    try {
      await saveSubmission(
        challengeId,
        avgTime,
        timerTime,
        solution,
        guidanceLevel,
        submitAttempts,
        language
      );
      
      // Refresh submissions list
      const loadedSubmissions = await getSubmissions(challengeId);
      setSubmissions(loadedSubmissions);
      setIsSidebarExpanded(true);
    } catch (error) {
      console.error('Failed to save submission:', error);
    }
  }

  async function finalizeSubmission(submission, guidanceLevel, timerTime) {
    if (!submission) {
      return;
    }
    if (timerTime !== UNTRACKED_TIMER_VALUE) {
      timerRef.current?.setTime(timerTime);
    }
    setSavedTimerTime(timerTime);
    setCanSave(true);
    await saveSubmissionAndRefresh({
      challengeId: submission.challengeId,
      avgTime: submission.avgTime,
      timerTime,
      solution: submission.solution,
      guidanceLevel,
      submitAttempts: submission.submitAttempts,
      language: currentLanguage
    });
    setBugHintUsed(false);
    setBugHintEvaluation(null);
    setGuidanceDisabledOptions([]);
    await evaluateNextChallenge();
  }

  async function evaluateNextChallenge() {
    clearNextChallengeCountdown();
    setIsNextChallengeOpen(true);
    setNextChallengeLoading(true);
    setNextChallengeError(null);
    setNextChallengeRecommendation(null);
    setNextChallengeId(null);
    setNextChallengeCountdown(5);

    try {
      const metadata = await fetchChallengesMetadata();
      const eligibleMetadata = metadata.filter((challenge) => (
        !Array.isArray(challenge.languages) || challenge.languages.includes(currentLanguage)
      ));
      const { from } = getRecentDateRange(14);
      const recentSubmissions = await loadAllSubmissions({
        from,
        language: currentLanguage
      });
      const response = await fetch('/api/recommend-next-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissions: recentSubmissions,
          challenges: eligibleMetadata
        })
      });

      if (!response.ok) {
        throw new Error('Failed to load recommendation');
      }

      const data = await response.json();
      const recommendation = {
        name: data.name,
        difficulty: data.difficulty,
        explanation: data.explanation
      };
      const matched = findChallengeByName(data.name, eligibleMetadata);
      setNextChallengeRecommendation(recommendation);
      setNextChallengeId(matched ? matched.id : null);
    } catch (error) {
      setNextChallengeError(error.message || 'Failed to load recommendation.');
    } finally {
      setNextChallengeLoading(false);
    }
  }

  async function handleSubmissionMetadataSave(guidanceLevel, timerTime) {
    const submission = pendingSubmission;
    setPendingSubmission(null);
    setIsSubmissionMetadataOpen(false);
    await finalizeSubmission(submission, guidanceLevel, timerTime);
  }

  async function handleSubmissionMetadataUntracked(guidanceLevel) {
    const submission = pendingSubmission;
    setPendingSubmission(null);
    setIsSubmissionMetadataOpen(false);
    await finalizeSubmission(submission, guidanceLevel, UNTRACKED_TIMER_VALUE);
  }

  async function handleSubmissionMetadataClose() {
    if (!pendingSubmission) {
      setIsSubmissionMetadataOpen(false);
      return;
    }
    const defaultGuidanceLevel = guidanceDisabledOptions.length > 0 ? 'Guided' : 'Independent';
    if (pendingSubmission.timerTime === 0) {
      await handleSubmissionMetadataUntracked(defaultGuidanceLevel);
    } else {
      await handleSubmissionMetadataSave(defaultGuidanceLevel, pendingSubmission.timerTime);
    }
  }

  function buildTestCasesPreview() {
    return {
      runTests: (testCases.runTests || []).slice(0, 3).map((test) => ({
        id: test.id,
        name: test.name,
        input: test.input
      })),
      submitTests: (testCases.submitTests || []).slice(0, 3).map((test) => ({
        id: test.id,
        name: test.name,
        input: test.input
      }))
    };
  }

  async function evaluateBugHintImpact(answer, codeToEvaluate = code) {
    if (!answer || typeof answer !== 'string') {
      return null;
    }

    try {
      const challengeMatch = challenges.find((challenge) => challenge.id === currentChallenge);
      const evalResponse = await fetch('/api/bug-hunt-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToEvaluate,
          challengeId: currentChallenge,
          challengeName: challengeMatch?.name || '',
          language: currentLanguage,
          descriptionHtml: description,
          testCasesPreview: buildTestCasesPreview(),
          bugAnswer: answer
        })
      });

      const evalData = await evalResponse.json().catch(() => ({}));
      if (!evalResponse.ok || typeof evalData.disableMinor !== 'boolean') {
        return null;
      }

      setBugHintEvaluation(evalData.disableMinor);
      return evalData.disableMinor;
    } catch (error) {
      console.warn('Bug hint evaluation failed:', error);
      return null;
    }
  }

  function openGuideChat() {
    setGuideError('');
    setIsGuideChatOpen(true);
  }

  function handleGuideRequest() {
    setGuideError('');
    setIsGuideConfirmOpen(true);
  }

  function handleGuideConfirm() {
    setIsGuideConfirmOpen(false);
    setGuideUsed(true);
    openGuideChat();
  }

  async function handleGuideSend() {
    const trimmedInput = (guideInput || '').trim();
    if (!trimmedInput || isGuideLoading) {
      return;
    }

    const nextUserMessage = { role: 'user', content: trimmedInput };
    const nextMessages = [...guideMessages, nextUserMessage];
    setGuideMessages(nextMessages);
    setGuideInput('');
    setGuideError('');
    setIsGuideLoading(true);

    const challengeMatch = challenges.find((challenge) => challenge.id === currentChallenge);
    const payload = {
      messages: nextMessages,
      code,
      challengeId: currentChallenge,
      challengeName: challengeMatch?.name || '',
      language: currentLanguage,
      descriptionHtml: description,
      testCasesPreview: buildTestCasesPreview()
    };

    try {
      const response = await fetch('/api/guide-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setGuideError(data.error || 'Failed to get guided response.');
        return;
      }

      const answer = typeof data.answer === 'string' ? data.answer.trim() : '';
      setGuideMessages((prev) => [
        ...prev,
        { role: 'assistant', content: answer || 'No response returned.' }
      ]);
    } catch (error) {
      setGuideError(error.message || 'Failed to get guided response.');
    } finally {
      setIsGuideLoading(false);
    }
  }

  async function handleSubmit() {
    setCurrentActionType('submit');
    setRunningAction('submit');
    setTestResults(null);
    setCanSave(false);
    setSavedTimerTime(null);
    const submitAttempts = incrementSubmitAttempts(currentChallenge, currentLanguage);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, challenge: currentChallenge, language: currentLanguage })
      });

      const data = await response.json();
      
      if (data.success) {
        // Save implementation
        saveImplementation(
          code,
          data.avgTime || 0,
          data.results?.length || 0,
          data.passed || false,
          currentChallenge,
          currentLanguage
        );
        setRefreshTrigger(prev => prev + 1);
      }

      const allPassed = data.passed === true && data.results?.every(r => r.passed);
      
      if (allPassed) {
        const disabledOptions = [];
        if (guideUsed) {
          disabledOptions.push('Independent', 'Minor');
        } else {
          if (bugHintUsed) {
            disabledOptions.push('Independent');
          }

          let disableMinor = bugHintEvaluation;

          if (disableMinor === null && bugHintUsed && bugAnswer) {
            disableMinor = await evaluateBugHintImpact(bugAnswer, code);
          }

          if (disableMinor === true) {
            disabledOptions.push('Minor');
          }
        }

        setGuidanceDisabledOptions(disabledOptions);

        // Stop the timer only when submission passes
        timerRef.current?.stop();
        // Capture timer time when submit succeeds
        const timerTime = timerRef.current?.getElapsedTime() || 0;
        resetSubmitAttempts(currentChallenge, currentLanguage);
        setPendingSubmission({
          challengeId: currentChallenge,
          avgTime: data.avgTime || 0,
          solution: code,
          timerTime,
          submitAttempts
        });
        setIsSubmissionMetadataOpen(true);
      }

      setTestResults({
        results: data.results || [],
        totalTime: data.totalTime,
        avgTime: data.avgTime,
        error: data.error
      });
    } catch (error) {
      setTestResults({
        results: [],
        error: error.message || 'Failed to execute code'
      });
    } finally {
      setRunningAction(null);
    }
  }

  async function handleSave() {
    if (!canSave || !testResults || !savedTimerTime) {
      return;
    }

    try {
      await saveSubmission(
        currentChallenge,
        testResults.avgTime || 0,
        savedTimerTime,
        code,
        'Independent',
        null,
        currentLanguage
      );
      
      // Refresh submissions list
      const loadedSubmissions = await getSubmissions(currentChallenge);
      setSubmissions(loadedSubmissions);
      
      // Optionally disable save button after saving (or keep enabled for multiple saves)
      // setCanSave(false);
    } catch (error) {
      console.error('Failed to save submission:', error);
      alert('Failed to save submission. Please try again.');
    }
  }

  async function handleDeleteSubmission(submissionId) {
    try {
      await deleteSubmission(submissionId, currentChallenge);
      
      // Refresh submissions list
      const loadedSubmissions = await getSubmissions(currentChallenge);
      setSubmissions(loadedSubmissions);
    } catch (error) {
      console.error('Failed to delete submission:', error);
      alert('Failed to delete submission. Please try again.');
    }
  }

  async function handleUpdateSubmission(submissionId, timerTime) {
    try {
      await updateSubmission(submissionId, timerTime, currentChallenge);
      
      // Refresh submissions list
      const loadedSubmissions = await getSubmissions(currentChallenge);
      setSubmissions(loadedSubmissions);
    } catch (error) {
      console.error('Failed to update submission:', error);
      alert('Failed to update submission. Please try again.');
    }
  }

  async function handleBugHunt() {
    setIsBugPopoverOpen(true);
    setIsBugLoading(true);
    setBugError('');
    setBugAnswer('');
    setBugHintUsed(true);
    setBugHintEvaluation(null);

    const challengeMatch = challenges.find((challenge) => challenge.id === currentChallenge);
    const testCasesPreview = buildTestCasesPreview();

    try {
      const bugHuntPayload = {
        code,
        challengeId: currentChallenge,
        challengeName: challengeMatch?.name || '',
        language: currentLanguage,
        descriptionHtml: description,
        testCasesPreview
      };
      const response = await fetch('/api/bug-hunt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bugHuntPayload)
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      if (!response.ok) {
        setBugError(data.error || 'Failed to get a bug hint.');
        return;
      }

      const hint = typeof data.answer === 'string' ? data.answer.trim() : '';
      setBugAnswer(hint || 'No answer returned.');
      if (hint) {
        void evaluateBugHintImpact(hint);
      }
    } catch (error) {
      setBugError(error.message || 'Failed to get a bug hint.');
    } finally {
      setIsBugLoading(false);
    }
  }

  function handleUseTestCase(testCase) {
    const testId = testCase?.id;
    if (testId === null || testId === undefined) {
      return;
    }
    setExtraRunTestIds((prev) => (prev.includes(testId) ? prev : [...prev, testId]));
  }

  const filteredSubmissions = submissions.filter(
    (submission) => normalizeLanguage(submission.language) === currentLanguage
  );
  const bugHintNote = bugHintEvaluation === null
    ? ''
    : bugHintEvaluation
      ? 'Note: This hint is significant; your submission will be marked as Guided.'
      : 'Note: Using this hint will mark your submission as Minor (hint).';
  const progressButtonTitle = progressEligible
    ? `View your daily progress report (${progressSubmissionCount} submission${progressSubmissionCount === 1 ? '' : 's'})`
    : 'Available after 4pm on days you submit';
  const baseRunTestIds = (testCases.runTests || []).slice(0, 3).map((test) => test.id);
  const availableLanguages = challenges.find((challenge) => challenge.id === currentChallenge)?.languages
    || ['java', 'python', 'javascript', 'typescript'];

  return (
    <div className="app">
      <Header 
        onRun={handleRun}
        onSubmit={handleSubmit}
        onResetSolution={handleResetSolution}
        onResetTimer={handleResetTimer}
        onToggleMaximize={handleToggleMaximize}
        isRunning={runningAction !== null}
        isRunningRun={runningAction === 'run'}
        isRunningSubmit={runningAction === 'submit'}
        isMaximized={isEditorMaximized}
        currentChallenge={currentChallenge}
        currentLanguage={currentLanguage}
        availableLanguages={availableLanguages}
        onLanguageChange={handleLanguageChange}
        timerRef={timerRef}
        timerInitialState={timerInitialState}
        onTimerStateChange={handleTimerStateChange}
        onGuide={handleGuideRequest}
        onInterviewerNotes={handleInterviewerNotesRequest}
        onProgress={handleProgressOpen}
        isProgressDisabled={!progressEligible}
        progressTitle={progressButtonTitle}
        onBugHunt={handleBugHunt}
        isBugHuntLoading={isBugLoading}
      />
      <SubmissionMetadataPopover
        isOpen={isSubmissionMetadataOpen}
        onClose={handleSubmissionMetadataClose}
        onSave={handleSubmissionMetadataSave}
        onUntracked={handleSubmissionMetadataUntracked}
        showTimerInputs={pendingSubmission?.timerTime === 0}
        initialTimerTime={pendingSubmission?.timerTime || 0}
        initialGuidanceLevel={guidanceDisabledOptions.length > 0 ? 'Guided' : 'Independent'}
        disabledGuidanceOptions={guidanceDisabledOptions}
      />
      <BugAnswerPopover
        isOpen={isBugPopoverOpen}
        onClose={() => setIsBugPopoverOpen(false)}
        isLoading={isBugLoading}
        error={bugError}
        answer={bugAnswer}
        note={bugHintNote}
      />
      <GuideConfirmPopover
        isOpen={isGuideConfirmOpen}
        onClose={() => setIsGuideConfirmOpen(false)}
        onConfirm={handleGuideConfirm}
      />
      <InterviewerNotesPopover
        isConfirmOpen={isInterviewerConfirmOpen}
        isNotesOpen={isInterviewerNotesOpen}
        onCancel={() => setIsInterviewerConfirmOpen(false)}
        onConfirm={handleInterviewerNotesConfirm}
        onClose={() => setIsInterviewerNotesOpen(false)}
        isLoading={isInterviewerNotesLoading}
        error={interviewerNotesError}
        notes={interviewerNotes}
      />
      <GuideChatPopover
        isOpen={isGuideChatOpen}
        onClose={() => setIsGuideChatOpen(false)}
        messages={guideMessages}
        inputValue={guideInput}
        onInputChange={setGuideInput}
        onSend={handleGuideSend}
        isLoading={isGuideLoading}
        error={guideError}
      />
      <ProgressReportPopover
        isOpen={isProgressPopoverOpen}
        onClose={() => setIsProgressPopoverOpen(false)}
        isLoading={isProgressReportLoading}
        error={progressReportError}
        report={progressReport}
      />
      <NextChallengePopover
        isOpen={isNextChallengeOpen}
        onClose={handleNextChallengeClose}
        isLoading={nextChallengeLoading}
        error={nextChallengeError}
        recommendation={nextChallengeRecommendation}
        nextChallengeId={nextChallengeId}
        countdown={nextChallengeCountdown}
        onContinue={handleNextChallengeContinue}
      />
      <div className="main-content">
        <div 
          className={`description-container ${!isDescriptionExpanded ? 'collapsed' : ''}`}
          style={{ width: !isDescriptionExpanded ? '32px' : `${dividerPosition}%` }}
        >
          <DescriptionPanel 
            isExpanded={isDescriptionExpanded}
            onToggle={handleToggleDescription}
            description={description}
          />
        </div>
        {isDescriptionExpanded && (
          <ResizableDivider onResize={handleDividerResize} />
        )}
        <div 
          className="editor-container"
          style={{ 
            width: !isDescriptionExpanded
              ? `calc(100% - 32px${isSidebarExpanded ? ' - 300px' : ' - 32px'})` 
              : `calc(${100 - dividerPosition}%${isSidebarExpanded ? ' - 300px' : ' - 32px'})`
          }}
        >
          <div 
            className={`editor-section ${isTestCasesMinimized || !isTestSectionExpanded ? 'full-height' : ''}`}
            style={
              isTestCasesMinimized 
                ? {} 
                : !isTestSectionExpanded 
                  ? { height: 'calc(100% - 32px)' }
                  : { height: `${100 - verticalDividerPosition}%` }
            }
          >
            <CodeEditor
              code={code}
              onChange={handleCodeChange}
              language={currentLanguage}
              onTyping={handleEditorTyping}
            />
          </div>
          {!isTestCasesMinimized && isTestSectionExpanded && (
            <ResizableDivider 
              onResize={handleVerticalDividerResize} 
              orientation="vertical"
            />
          )}
          <div 
            className={`test-cases-section ${isTestCasesMinimized ? 'minimized-bar' : ''} ${!isTestSectionExpanded ? 'collapsed' : ''}`}
            style={!isTestCasesMinimized && isTestSectionExpanded ? { height: `${verticalDividerPosition}%` } : !isTestSectionExpanded ? { height: '32px' } : {}}
          >
            {isTestCasesMinimized ? (
              <div className="test-cases-minimized-bar" onClick={handleToggleTestCasesMinimize}>
                <div className="test-results-minimized-bar">
                  <div className="test-cases-preview-header">
                    <h2>{testResults ? 'Test Results' : 'Test Cases'}</h2>
                    <IconButton
                      className="btn btn--icon-sm btn--ghost btn-minimize-testcases"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTestCasesMinimize();
                      }}
                      title={testResults ? 'Restore test results' : 'Restore test cases'}
                    >
                      ▲
                    </IconButton>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {testResults?.error && (
                  <div className="error-message">
                    <strong>Error:</strong>
                    <pre>{testResults.error}</pre>
                  </div>
                )}
                {!testResults && (
                  <TestCasesPreview
                    testCases={
                      currentActionType === 'submit' 
                        ? testCases.submitTests 
                        : currentActionType === 'run'
                        ? testCases.runTests
                        : testCases.runTests
                    }
                    isRunning={runningAction !== null}
                    actionType={currentActionType}
                    isExpanded={isTestSectionExpanded}
                    onToggle={handleToggleTestSection}
                  />
                )}
                {testResults && (
                  <TestResults
                    results={testResults?.results}
                    totalTime={testResults?.totalTime}
                    avgTime={testResults?.avgTime}
                    isExpanded={isTestSectionExpanded}
                    onToggle={handleToggleTestSection}
                    actionType={currentActionType}
                    onUseTestCase={handleUseTestCase}
                    baseRunTestIds={baseRunTestIds}
                    extraRunTestIds={extraRunTestIds}
                  />
                )}
              </>
            )}
          </div>
        </div>
        <SubmissionsSidebar
          isExpanded={isSidebarExpanded}
          onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
          submissions={filteredSubmissions}
          currentChallenge={currentChallenge}
          onDelete={handleDeleteSubmission}
          onUpdateSubmission={handleUpdateSubmission}
        />
      </div>
    </div>
  );
}

export default App;
