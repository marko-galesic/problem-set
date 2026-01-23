import React from 'react';
import Timer from './Timer';

export default function Header({ 
  onRun, 
  onSubmit, 
  onReset, 
  onToggleMaximize, 
  isRunning, 
  isRunningRun, 
  isRunningSubmit, 
  isMaximized,
  currentChallenge,
  challenges,
  onChallengeChange,
  currentLanguage,
  onLanguageChange,
  timerRef,
  timerInitialState,
  onTimerStateChange,
  onBugHunt,
  isBugHuntLoading,
  onGuide
}) {
  return (
    <div className="header">
      <div className="header-left">
        {challenges && challenges.length > 0 && (
          <select
            value={currentChallenge || 'two_sum'}
            onChange={(e) => onChallengeChange && onChallengeChange(e.target.value)}
            className="challenge-select"
            disabled={isRunning}
            title="Select challenge"
          >
            {challenges.map(challenge => (
              <option key={challenge.id} value={challenge.id}>
                {challenge.name}
              </option>
            ))}
          </select>
        )}
        <select
          value={currentLanguage || 'java'}
          onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
          className="language-select"
          disabled={isRunning}
          title="Select language"
        >
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
        </select>
        <Timer 
          key={currentChallenge}
          ref={timerRef}
          initialElapsedTime={timerInitialState?.elapsedTime || 0}
          initialIsRunning={timerInitialState?.isRunning || false}
          initialAccumulatedTime={timerInitialState?.accumulatedTime || 0}
          onStateChange={onTimerStateChange}
        />
      </div>
      <div className="header-actions">
        <button
          onClick={onGuide}
          disabled={isRunning}
          className="btn btn-guide"
          title="Open guided chat"
        >
          Guide me
        </button>
        <button
          onClick={onBugHunt}
          disabled={isRunning || isBugHuntLoading}
          className="btn btn-bug"
          title="Ask GPT-5 where the bug is"
        >
          {isBugHuntLoading ? 'Checking...' : "Where's the bug?"}
        </button>
        <a
          className="header-link"
          href="/#/submissions"
          target="_blank"
          rel="noreferrer"
          title="Open submissions in a new tab"
        >
          Submissions
        </a>
        <button 
          onClick={onToggleMaximize}
          className="btn btn-maximize"
          title={isMaximized ? 'Restore layout' : 'Maximize editor'}
        >
          {isMaximized ? '⊟' : '⊞'}
        </button>
        <button 
          onClick={onReset}
          disabled={isRunning}
          className="btn btn-reset"
          title="Reset to template"
        >
          Reset
        </button>
        <button 
          onClick={onRun} 
          disabled={isRunning}
          className="btn btn-run"
        >
          {isRunningRun ? 'Running...' : 'Run'}
        </button>
        <button 
          onClick={onSubmit} 
          disabled={isRunning}
          className="btn btn-submit"
        >
          {isRunningSubmit ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
