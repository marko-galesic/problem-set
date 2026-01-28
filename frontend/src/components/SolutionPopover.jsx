import React from 'react';

export default function SolutionPopover({ isOpen, onClose, solution }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="solution-popover-overlay" onClick={onClose}>
      <div className="solution-popover" onClick={(event) => event.stopPropagation()}>
        <div className="solution-popover-header">
          <span>Submission Solution</span>
          <button
            className="btn btn--icon btn--ghost btn--muted solution-popover-close"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="solution-popover-content">
          <pre className="solution-code">
            {solution || 'Solution not available for this submission.'}
          </pre>
        </div>
      </div>
    </div>
  );
}
