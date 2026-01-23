import React, { useEffect, useRef } from 'react';

export default function TimerAutoStartPopover({ isOpen, onConfirm, onDismiss, triggerRef }) {
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        triggerRef &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        onDismiss();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    return undefined;
  }, [isOpen, onDismiss, triggerRef]);

  useEffect(() => {
    if (isOpen && triggerRef?.current && popoverRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const top = triggerRect.bottom + 8;
      const left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);
      popoverRef.current.style.top = `${top}px`;
      popoverRef.current.style.left = `${left}px`;
    }
  }, [isOpen, triggerRef]);

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      onConfirm();
    } else if (event.key === 'Escape') {
      onDismiss();
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={popoverRef}
      className="timer-autostart-popover"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-live="polite"
    >
      <div className="timer-autostart-popover-header">
        <span>Start timer?</span>
      </div>
      <div className="timer-autostart-popover-content">
        <p>
          You have been working on this challenge for about a minute. Start the timer at 1:00?
        </p>
      </div>
      <div className="timer-autostart-popover-actions">
        <button className="btn-popover-save" onClick={onConfirm}>
          Start timer
        </button>
        <button className="btn-popover-cancel" onClick={onDismiss}>
          Not now
        </button>
      </div>
    </div>
  );
}
