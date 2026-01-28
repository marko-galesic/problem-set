import React, { useState, useRef } from 'react';
import { IconButton } from '@mui/material';
import TimerPopover from './TimerPopover';
import SolutionPopover from './SolutionPopover';

export default function SubmissionsSidebar({ isExpanded, onToggle, submissions, currentChallenge, onDelete, onUpdateSubmission }) {
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [openSolutionId, setOpenSolutionId] = useState(null);
  const timerRefs = useRef({});
  const rowRefs = useRef({});

  function formatTime(ms) {
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
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  function formatAttempts(value) {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    return String(value);
  }

  function handleTimerTimeClick(submissionId) {
    setOpenPopoverId(submissionId);
  }

  function handlePopoverClose() {
    setOpenPopoverId(null);
  }

  function handlePopoverSave(submissionId, newTime) {
    if (onUpdateSubmission) {
      onUpdateSubmission(submissionId, newTime);
    }
    setOpenPopoverId(null);
  }

  function handleSolutionClose() {
    setOpenSolutionId(null);
  }


  function getTimerRef(submissionId) {
    if (!timerRefs.current[submissionId]) {
      timerRefs.current[submissionId] = { current: null };
    }
    return timerRefs.current[submissionId];
  }

  function getRowRef(submissionId) {
    if (!rowRefs.current[submissionId]) {
      rowRefs.current[submissionId] = { current: null };
    }
    return rowRefs.current[submissionId];
  }

  if (!isExpanded) {
    return (
      <div className="submissions-sidebar collapsed">
        <IconButton 
          className="btn btn--icon btn--ghost btn-sidebar-toggle"
          onClick={onToggle}
          title="Show submissions"
          type="button"
        >
          ▶
        </IconButton>
      </div>
    );
  }

  return (
    <div className="submissions-sidebar">
      <div className="submissions-sidebar-header">
        <h2>Submissions</h2>
        <IconButton 
          className="btn btn--icon btn--ghost btn-sidebar-toggle"
          onClick={onToggle}
          title="Hide submissions"
          type="button"
        >
          ◀
        </IconButton>
      </div>
      <div className="submissions-sidebar-content">
        {submissions.length === 0 ? (
          <div className="submissions-empty">
            <p>No submissions yet</p>
            <p className="submissions-empty-hint">Complete all tests to save a submission</p>
          </div>
        ) : (
          <div className="submissions-list">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                ref={getRowRef(submission.id)}
                className="submission-item"
                onClick={() => {
                  setOpenPopoverId(null);
                  setOpenSolutionId(submission.id);
                }}
                title="Click to view solution"
              >
                <div className="submission-row-content">
                  <div className="submission-data-line">
                    <span className="submission-date">{formatDate(submission.date)}</span>
                  </div>
                  <div className="submission-data-line">
                    <span className="submission-stat-label">Avg Runtime:</span>
                    <span className="submission-stat-value">{submission.avgTime}ms</span>
                  </div>
                  <div className="submission-data-line">
                    <span className="submission-stat-label">Timer Time:</span>
                    <span 
                      ref={getTimerRef(submission.id)}
                      className="submission-stat-value submission-timer-time-clickable"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleTimerTimeClick(submission.id);
                      }}
                      title="Click to edit timer time"
                    >
                      {formatTime(submission.timerTime)}
                    </span>
                  </div>
                  <div className="submission-data-line">
                    <span className="submission-stat-label">Submit Attempts:</span>
                    <span className="submission-stat-value">
                      {formatAttempts(submission.submitAttempts)}
                    </span>
                  </div>
                  <div className="submission-data-line">
                    <span className="submission-stat-label">Guidance:</span>
                    <span className="submission-stat-value">
                      {submission.guidanceLevel || 'Independent'}
                    </span>
                  </div>
                </div>
                <IconButton
                  className="btn btn--icon btn--danger-ghost btn-delete-submission"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete && onDelete(submission.id);
                  }}
                  title="Delete submission"
                  type="button"
                >
                  ×
                </IconButton>
                <TimerPopover
                  isOpen={openPopoverId === submission.id}
                  onClose={handlePopoverClose}
                  currentTime={submission.timerTime}
                  onSave={(newTime) => handlePopoverSave(submission.id, newTime)}
                  triggerRef={getTimerRef(submission.id)}
                />
                <SolutionPopover
                  isOpen={openSolutionId === submission.id}
                  onClose={handleSolutionClose}
                  solution={submission.solution}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
