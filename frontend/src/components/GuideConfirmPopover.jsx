import React from 'react';

export default function GuideConfirmPopover({ isOpen, onClose, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="guide-confirm-popover-overlay" onClick={onClose}>
      <div
        className="guide-confirm-popover"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="guide-confirm-popover-header">
          <span>Guide me</span>
          <button
            className="guide-confirm-popover-close"
            onClick={onClose}
            aria-label="Close"
          >
            x
          </button>
        </div>
        <div className="guide-confirm-popover-content">
          <p>
            Guide me opens a chat with an AI teacher to help you reach the solution.
          </p>
          <p>
            Continuing will mark your submission as Guided and lock the other guidance options.
          </p>
          <p>Do you want to continue?</p>
        </div>
        <div className="guide-confirm-popover-actions">
          <button className="btn-popover-save" onClick={onConfirm}>
            Continue
          </button>
          <button className="btn-popover-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
