import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import * as storage from '../utils/storage';

vi.mock('../components/Header', () => ({
  default: ({
    onRun,
    onSubmit,
    onResetSolution,
    onResetTimer,
    onToggleMaximize,
    onBugHunt,
    onGuide,
    onInterviewerNotes,
    onProgress
  }) => (
    <div>
      <button type="button" onClick={onRun}>run</button>
      <button type="button" onClick={onSubmit}>submit</button>
      <button type="button" onClick={onResetSolution}>reset-solution</button>
      <button type="button" onClick={onResetTimer}>reset-timer</button>
      <button type="button" onClick={onToggleMaximize}>maximize</button>
      <button type="button" onClick={onBugHunt}>bug</button>
      <button type="button" onClick={onGuide}>guide</button>
      <button type="button" onClick={onInterviewerNotes}>interviewer</button>
      <button type="button" onClick={onProgress}>progress</button>
      <a href="/#/challenges">Challenges</a>
    </div>
  )
}));

vi.mock('../components/CodeEditor', () => ({
  default: ({ onChange, onTyping }) => {
    React.useEffect(() => {
      onChange?.('new code');
      onTyping?.();
    }, [onChange, onTyping]);
    return <div>editor</div>;
  }
}));

vi.mock('../components/TestResults', () => ({
  default: ({ results, onUseTestCase, onToggle }) => (
    <div>
      <div>results:{results?.length ?? 0}</div>
      <button type="button" onClick={() => onUseTestCase?.({ id: 'extra' })}>use-case</button>
      <button type="button" onClick={onToggle}>toggle-test-section</button>
    </div>
  )
}));

vi.mock('../components/TestCasesPreview', () => ({
  default: ({ testCases = [], isExpanded, onToggle }) => (
    <div>
      <div>testcases:{testCases.length}:{isExpanded ? 'expanded' : 'collapsed'}</div>
      <button type="button" onClick={onToggle}>toggle-test-section</button>
    </div>
  )
}));

vi.mock('../components/DescriptionPanel', () => ({
  default: ({ onToggle }) => <button type="button" onClick={onToggle}>toggle-description</button>
}));

vi.mock('../components/ResizableDivider', () => ({
  default: ({ onResize }) => (
    <button type="button" onClick={() => onResize?.(55)}>
      resize
    </button>
  )
}));

vi.mock('../components/SubmissionsSidebar', () => ({
  default: ({ onDelete, onUpdateSubmission, onToggle, submissions = [] }) => (
    <div>
      <div>submissions:{submissions.length}</div>
      <button type="button" onClick={onToggle}>toggle-sidebar</button>
      <button type="button" onClick={() => onDelete?.('id')}>delete</button>
      <button type="button" onClick={() => onUpdateSubmission?.('id', 1000)}>update</button>
    </div>
  )
}));

vi.mock('../components/SubmissionMetadataPopover', () => ({
  default: ({ isOpen, onSave, onUntracked, onClose }) =>
    isOpen ? (
      <div>
        <button type="button" onClick={() => onSave('Independent', 5000)}>save-metadata</button>
        <button type="button" onClick={() => onUntracked('Guided')}>untracked</button>
        <button type="button" onClick={onClose}>close-metadata</button>
      </div>
    ) : null
}));

vi.mock('../components/BugAnswerPopover', () => ({
  default: ({ isOpen }) => (isOpen ? <div>bug-popover</div> : null)
}));

vi.mock('../components/GuideConfirmPopover', () => ({
  default: ({ isOpen, onConfirm }) =>
    isOpen ? <button type="button" onClick={onConfirm}>confirm-guide</button> : null
}));

vi.mock('../components/GuideChatPopover', () => ({
  default: ({ isOpen, onSend, onInputChange }) =>
    isOpen ? (
      <div>
        <button type="button" onClick={() => onInputChange?.('hi')}>type</button>
        <button type="button" onClick={onSend}>send</button>
      </div>
    ) : null
}));

vi.mock('../components/NextChallengePopover', () => ({
  default: ({ isOpen, onClose, onContinue }) => (
    isOpen ? (
      <div>
        <div>next-challenge</div>
        <button type="button" onClick={onContinue}>next-continue</button>
        <button type="button" onClick={onClose}>next-close</button>
      </div>
    ) : null
  )
}));

vi.mock('../components/ProgressReportPopover', () => ({
  default: ({ isOpen }) => (isOpen ? <div>progress-popover</div> : null)
}));

vi.mock('../components/InterviewerNotesPopover', () => ({
  default: ({ isConfirmOpen, isNotesOpen, onConfirm, error, notes }) => (
    <div>
      {isConfirmOpen && <button type="button" onClick={onConfirm}>confirm-interviewer</button>}
      {isNotesOpen && <div>interviewer-dialog:{error || notes || 'loading'}</div>}
    </div>
  )
}));

vi.mock('../utils/storage', () => ({
  saveImplementation: vi.fn(),
  getDividerPosition: vi.fn(() => 25),
  saveDividerPosition: vi.fn(),
  getEditorMaximized: vi.fn(() => false),
  saveEditorMaximized: vi.fn(),
  getVerticalDividerPosition: vi.fn(() => 40),
  saveVerticalDividerPosition: vi.fn(),
  saveCurrentCode: vi.fn(),
  getCurrentCode: vi.fn(() => null),
  saveSubmission: vi.fn(async () => ({ id: 'saved' })),
  getSubmissions: vi.fn(async () => []),
  deleteSubmission: vi.fn(async () => ({})),
  updateSubmission: vi.fn(async () => ({})),
  saveTimerState: vi.fn(),
  getTimerState: vi.fn(() => null),
  incrementSubmitAttempts: vi.fn(() => 1),
  resetSubmitAttempts: vi.fn(),
  getLanguagePreference: vi.fn(async () => 'java'),
  saveLanguagePreference: vi.fn(async () => 'java')
}));

function createFetchMock(overrides = {}) {
  const resolveOverride = (override, fallback) => {
    if (!override) {
      return fallback;
    }
    if (typeof override === 'function') {
      return override;
    }
    return async () => override;
  };

  const challengeMetadataHandler = resolveOverride(overrides.challengeMetadata, async () => ({
    ok: true,
    json: async () => ({ challenges: [{ id: 'two_sum', name: 'Two Sum', difficulty: 'Easy' }] })
  }));
  const challengesHandler = resolveOverride(overrides.challenges, async () => ({
    ok: true,
    json: async () => ({ challenges: [{ id: 'two_sum', name: 'Two Sum' }] })
  }));
  const templateHandler = resolveOverride(overrides.template, async () => ({
    ok: true,
    json: async () => ({ code: 'template' })
  }));
  const descriptionHandler = resolveOverride(overrides.description, async () => ({
    ok: true,
    json: async () => ({ description: '<p>desc</p>' })
  }));
  const interviewerNotesHandler = resolveOverride(overrides.interviewerNotes, async () => ({
    ok: true,
    status: 200,
    json: async () => ({ notes: '<h2>Private rubric</h2>' })
  }));
  const testCasesHandler = resolveOverride(overrides.testCases, async () => ({
    ok: true,
    json: async () => ({
      runTests: [{ id: 'r1', name: 'Run1', input: '1' }],
      submitTests: [{ id: 's1', name: 'Sub1', input: '2' }]
    })
  }));
  const submissionsByChallengeHandler = resolveOverride(overrides.submissionsByChallenge, async () => ({
    ok: true,
    json: async () => ({ submissions: [] })
  }));
  const submissionsScopeAllHandler = resolveOverride(overrides.submissionsScopeAll, async () => ({
    ok: true,
    json: async () => ({ submissions: [], hasMore: false })
  }));
  const runHandler = resolveOverride(overrides.run, async () => ({
    ok: true,
    json: async () => ({ results: [{ passed: true, testCase: { id: 'r1', name: 'Run1' } }], totalTime: 10 })
  }));
  const submitHandler = resolveOverride(overrides.submit, async () => ({
    ok: true,
    json: async () => ({
      success: true,
      passed: true,
      results: [{ passed: true, testCase: { id: 's1', name: 'Sub1' } }],
      avgTime: 12,
      totalTime: 12
    })
  }));
  const cleanupHandler = resolveOverride(overrides.cleanup, async () => ({
    ok: true,
    json: async () => ({})
  }));
  const recommendHandler = resolveOverride(overrides.recommendNextChallenge, async () => ({
    ok: true,
    json: async () => ({ name: 'Two Sum', difficulty: 'Easy', explanation: 'Ok' })
  }));
  const bugHuntEvaluateHandler = resolveOverride(overrides.bugHuntEvaluate, async () => ({
    ok: true,
    json: async () => ({ disableMinor: false })
  }));
  const bugHuntHandler = resolveOverride(overrides.bugHunt, async () => ({
    ok: true,
    json: async () => ({ answer: 'Try map' })
  }));
  const guideChatHandler = resolveOverride(overrides.guideChat, async () => ({
    ok: true,
    json: async () => ({ answer: 'Use map' })
  }));
  const progressReportHandler = resolveOverride(overrides.progressReport, async () => ({
    ok: true,
    json: async () => ({ report: 'Progress' })
  }));

  return vi.fn(async (input) => {
    const url = typeof input === 'string' ? input : input.url;

    if (url.startsWith('/api/challenges/metadata')) {
      return challengeMetadataHandler(url);
    }

    if (url.startsWith('/api/challenges')) {
      return challengesHandler(url);
    }

    if (url.startsWith('/api/template')) {
      return templateHandler(url);
    }

    if (url.startsWith('/api/description')) {
      return descriptionHandler(url);
    }

    if (url.startsWith('/api/interviewer-notes')) {
      return interviewerNotesHandler(url);
    }

    if (url.startsWith('/api/test-cases')) {
      return testCasesHandler(url);
    }

    if (url.startsWith('/api/submissions?scope=all')) {
      return submissionsScopeAllHandler(url);
    }

    if (url.startsWith('/api/submissions?challenge=')) {
      return submissionsByChallengeHandler(url);
    }

    if (url.startsWith('/api/run')) {
      return runHandler(url);
    }

    if (url.startsWith('/api/submit')) {
      return submitHandler(url);
    }

    if (url.startsWith('/api/cleanup')) {
      return cleanupHandler(url);
    }

    if (url.startsWith('/api/recommend-next-challenge')) {
      return recommendHandler(url);
    }

    if (url.startsWith('/api/bug-hunt-evaluate')) {
      return bugHuntEvaluateHandler(url);
    }

    if (url.startsWith('/api/bug-hunt')) {
      return bugHuntHandler(url);
    }

    if (url.startsWith('/api/guide-chat')) {
      return guideChatHandler(url);
    }

    if (url.startsWith('/api/progress-report')) {
      return progressReportHandler(url);
    }

    if (url.startsWith('http://127.0.0.1:7245/ingest')) {
      return { ok: true, json: async () => ({}) };
    }

    return { ok: true, json: async () => ({}) };
  });
}

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', createFetchMock());
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('loads data and handles core actions', async () => {
    const now = new Date().toISOString();
    storage.getSubmissions.mockResolvedValue([
      { id: 's1', language: 'python', challenge: 'two_sum', date: now },
      { id: 's2', language: 'JS', challenge: 'two_sum', date: now },
      { id: 's3', language: 'TS', challenge: 'two_sum', date: now },
      { id: 's4', language: null, challenge: 'two_sum', date: now }
    ]);
    storage.getTimerState.mockReturnValue({ elapsedTime: 120, isRunning: true, accumulatedTime: 120 });

    render(<App />);

    expect(await screen.findByText('editor')).toBeInTheDocument();
    expect(await screen.findByText('submissions:1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('toggle-description'));
    const resizeButtons = await screen.findAllByText('resize');
    resizeButtons.forEach((button) => fireEvent.click(button));

    fireEvent.click(screen.getByText('toggle-test-section'));
    fireEvent.click(screen.getByText('toggle-test-section'));

    fireEvent.click(screen.getByText('toggle-sidebar'));
    fireEvent.click(screen.getByText('delete'));
    fireEvent.click(screen.getByText('update'));

    fireEvent.click(screen.getByText('run'));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/run', expect.any(Object)));
    fireEvent.click(await screen.findByText('use-case'));

    fireEvent.click(screen.getByText('run'));
    await waitFor(() => {
      const runCalls = fetch.mock.calls.filter(([url]) => url === '/api/run');
      expect(runCalls.length).toBeGreaterThan(1);
      const body = JSON.parse(runCalls[runCalls.length - 1][1].body);
      expect(body.testIds).toContain('extra');
    });

    fireEvent.click(screen.getByText('submit'));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/submit', expect.any(Object)));
    fireEvent.click(await screen.findByText('save-metadata'));
    expect(await screen.findByText('next-challenge')).toBeInTheDocument();
    fireEvent.click(screen.getByText('next-continue'));

    fireEvent.click(screen.getByText('bug'));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/bug-hunt', expect.any(Object)));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/bug-hunt-evaluate', expect.any(Object)));

    fireEvent.click(screen.getByText('guide'));
    fireEvent.click(await screen.findByText('confirm-guide'));
    fireEvent.click(await screen.findByText('type'));
    fireEvent.click(await screen.findByText('send'));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/guide-chat', expect.any(Object)));

    fireEvent.click(screen.getByText('reset-solution'));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/cleanup?challenge=two_sum', expect.any(Object)));

    fireEvent.click(screen.getByText('maximize'));
  });

  it('does not fetch interviewer notes until disclosure is confirmed', async () => {
    render(<App />);
    await screen.findByText('editor');

    expect(fetch.mock.calls.some(([url]) => url.startsWith('/api/interviewer-notes'))).toBe(false);
    fireEvent.click(screen.getByText('interviewer'));
    expect(await screen.findByText('confirm-interviewer')).toBeInTheDocument();
    expect(fetch.mock.calls.some(([url]) => url.startsWith('/api/interviewer-notes'))).toBe(false);

    fireEvent.click(screen.getByText('confirm-interviewer'));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/interviewer-notes?challenge=two_sum'));
    expect(await screen.findByText(/Private rubric/)).toBeInTheDocument();
  });

  it('shows a contained error when interviewer notes are missing', async () => {
    vi.stubGlobal('fetch', createFetchMock({
      interviewerNotes: {
        ok: false,
        status: 404,
        json: async () => ({ error: 'Interviewer notes not found' })
      }
    }));

    render(<App />);
    await screen.findByText('editor');
    fireEvent.click(screen.getByText('interviewer'));
    fireEvent.click(await screen.findByText('confirm-interviewer'));

    expect(await screen.findByText(/not available for this challenge/i)).toBeInTheDocument();
  });

  it('generates a progress report after 4pm', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2024, 0, 1, 17, 0, 0));

    const now = new Date();
    localStorage.setItem(
      'daily_progress_report_v1',
      JSON.stringify({ dateKey: '2020-01-01', signature: 'old', report: 'Old' })
    );

    vi.stubGlobal('fetch', createFetchMock({
      submissionsScopeAll: async () => ({
        ok: true,
        json: async () => ({
          submissions: [
            { id: 'today-1', challenge: 'two_sum', language: 'java', date: now.toISOString() }
          ],
          hasMore: false
        })
      })
    }));

    storage.getSubmissions.mockResolvedValue([]);

    render(<App />);

    expect(await screen.findByText('editor')).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/progress-report', expect.any(Object)));

    fireEvent.click(screen.getByText('progress'));
    expect(await screen.findByText('progress-popover')).toBeInTheDocument();
  });

  it('falls back on reset and supports untracked submission close', async () => {
    vi.stubGlobal('fetch', createFetchMock({
      template: {
        ok: true,
        json: async () => ({})
      }
    }));
    storage.getCurrentCode.mockReturnValue('saved code');
    storage.getSubmissions.mockResolvedValue([]);

    render(<App />);

    expect(await screen.findByText('editor')).toBeInTheDocument();

    fireEvent.click(screen.getByText('submit'));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/submit', expect.any(Object)));
    fireEvent.click(await screen.findByText('close-metadata'));
    expect(await screen.findByText('next-challenge')).toBeInTheDocument();
    fireEvent.click(screen.getByText('next-close'));

    fireEvent.click(screen.getByText('reset-solution'));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/cleanup?challenge=two_sum', expect.any(Object)));
  });
});

