import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function BugAnswerPopover({
  isOpen,
  onClose,
  isLoading,
  error,
  answer,
  note
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="bug-answer-popover-overlay" onClick={onClose}>
      <div
        className="bug-answer-popover"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="bug-answer-popover-header">
          <span>Where&apos;s the bug?</span>
          <button
            className="bug-answer-popover-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="bug-answer-popover-content">
          {isLoading && (
            <div className="bug-answer-popover-status">
              Asking GPT-5 for a hint...
            </div>
          )}
          {!isLoading && error && (
            <div className="bug-answer-popover-error">
              {error}
            </div>
          )}
          {!isLoading && !error && (
            <>
              <div className="bug-answer-popover-answer">
                <ReactMarkdown>{answer || 'No answer returned.'}</ReactMarkdown>
              </div>
              {note && (
                <div className="bug-answer-popover-note">
                  {note}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
