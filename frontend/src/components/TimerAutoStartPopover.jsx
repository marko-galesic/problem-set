import React, { useRef } from 'react';

export default function TimerAutoStartPopover({ isOpen, onConfirm, onDismiss }) {
  const popoverRef = useRef(null);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="timer-autostart-popover-overlay" role="dialog" aria-live="polite" aria-modal="true">
      <div ref={popoverRef} className="timer-autostart-popover">
        <div className="timer-autostart-popover-header">
          <span>Start timer?</span>
          <button
            className="btn btn--icon btn--ghost btn--muted timer-autostart-popover-close"
            onClick={onDismiss}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="timer-autostart-popover-content">
          <p>
            We tracked a minute while you were typing. Add it to the timer and start tracking now?
          </p>
        </div>
        <div className="timer-autostart-popover-actions">
          <button className="btn btn--sm btn-popover-save" onClick={onConfirm} type="button">
            Start timer at 1:00
          </button>
          <button className="btn btn--sm btn-popover-cancel" onClick={onDismiss} type="button">
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
