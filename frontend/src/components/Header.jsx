import React, { useState } from 'react';
import { Button } from '@mui/material';
import Timer from './Timer';
import ResetPopover from './ResetPopover';

export default function Header({ 
  onRun, 
  onSubmit, 
  onResetSolution,
  onResetTimer,
  onToggleMaximize, 
  isRunning, 
  isRunningRun, 
  isRunningSubmit, 
  isMaximized,
  currentChallenge,
  currentLanguage,
  timerRef,
  timerInitialState,
  onTimerStateChange,
  onBugHunt,
  isBugHuntLoading,
  onGuide,
  onInterviewerNotes,
  onProgress,
  isProgressDisabled,
  progressTitle
}) {
  const [isResetOpen, setIsResetOpen] = useState(false);

  function handleResetPopoverOpen() {
    setIsResetOpen(true);
  }

  function handleResetPopoverClose() {
    setIsResetOpen(false);
  }

  return (
    <div className="header">
      <div className="header-left">
        <a
          className="header-link"
          href="/#/challenges"
          target="_blank"
          rel="noreferrer"
          title="Browse challenges in a new tab"
        >
          Challenges
        </a>
        <Timer 
          key={`${currentChallenge}_${currentLanguage}`}
          ref={timerRef}
          initialElapsedTime={timerInitialState?.elapsedTime || 0}
          initialIsRunning={timerInitialState?.isRunning || false}
          initialAccumulatedTime={timerInitialState?.accumulatedTime || 0}
          onStateChange={onTimerStateChange}
        />
      </div>
      <div className="header-actions">
        <Button
          onClick={onInterviewerNotes}
          disabled={isRunning}
          className="btn btn-interviewer-notes"
          type="button"
          title="Open session-only interviewer notes"
        >
          Interviewer notes
        </Button>
        <Button
          onClick={onProgress}
          disabled={isRunning || isProgressDisabled}
          className="btn btn-progress"
          type="button"
          title={progressTitle || 'View your daily progress report'}
        >
          Your Progress
        </Button>
        <Button
          onClick={onGuide}
          disabled={isRunning}
          className="btn btn-guide"
          type="button"
          title="Open guided chat"
        >
          Guide me
        </Button>
        <Button
          onClick={onBugHunt}
          disabled={isRunning || isBugHuntLoading}
          className="btn btn-bug"
          type="button"
          title="Ask GPT-5 where the bug is"
        >
          {isBugHuntLoading ? 'Checking...' : "Where's the bug?"}
        </Button>
        <a
          className="header-link"
          href="/#/submissions"
          target="_blank"
          rel="noreferrer"
          title="Open submissions in a new tab"
        >
          Submissions
        </a>
        <Button 
          onClick={onToggleMaximize}
          className="btn btn-maximize"
          type="button"
          title={isMaximized ? 'Restore layout' : 'Maximize editor'}
        >
          {isMaximized ? '⊟' : '⊞'}
        </Button>
        <Button 
          onClick={handleResetPopoverOpen}
          disabled={isRunning}
          className="btn btn-reset"
          type="button"
          aria-label="Reset options"
          title="Reset options"
        >
          <span aria-hidden="true">↻</span>
        </Button>
        <ResetPopover
          isOpen={isResetOpen}
          onClose={handleResetPopoverClose}
          onResetSolution={onResetSolution}
          onResetTimer={onResetTimer}
        />
        <Button 
          onClick={onRun} 
          disabled={isRunning}
          className="btn btn-run"
          type="button"
        >
          {isRunningRun ? 'Running...' : 'Run'}
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={isRunning}
          className="btn btn-submit"
          type="button"
        >
          {isRunningSubmit ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </div>
  );
}

