import React, { useState, useEffect, useRef } from 'react';

export default function TimerPopover({ 
  isOpen, 
  onClose, 
  currentTime, 
  onSave, 
  triggerRef,
  allowUntracked = false,
  onUntracked,
  headerText = 'Set Timer Time',
  untrackedLabel = 'Untracked'
}) {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const popoverRef = useRef(null);

  // Convert milliseconds to HH:MM:SS
  function msToTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return { hours: h, minutes: m, seconds: s };
  }

  // Convert HH:MM:SS to milliseconds
  function timeToMs(h, m, s) {
    return (h * 3600 + m * 60 + s) * 1000;
  }

  // Initialize form when popover opens or currentTime changes
  useEffect(() => {
    if (isOpen && currentTime !== undefined) {
      const time = msToTime(currentTime);
      setHours(time.hours.toString());
      setMinutes(time.minutes.toString());
      setSeconds(time.seconds.toString());
    }
  }, [isOpen, currentTime]);

  function handleUntracked() {
    if (onUntracked) {
      onUntracked();
    }
    onClose();
  }

  // Handle click outside to close
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
        if (allowUntracked) {
          handleUntracked();
        } else {
          onClose();
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose, triggerRef]);

  // Position popover relative to trigger
  useEffect(() => {
    if (isOpen && triggerRef?.current && popoverRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      
      // Position below the trigger, centered
      const top = triggerRect.bottom + 8;
      const left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);
      
      popoverRef.current.style.top = `${top}px`;
      popoverRef.current.style.left = `${left}px`;
    }
  }, [isOpen, triggerRef]);

  function handleSave() {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;

    // Validate: minutes and seconds should be 0-59
    if (m < 0 || m > 59 || s < 0 || s > 59 || h < 0) {
      alert('Invalid time values. Hours must be >= 0, minutes and seconds must be 0-59.');
      return;
    }

    const newTime = timeToMs(h, m, s);
    onSave(newTime);
    onClose();
  }

  function handleCancel() {
    if (allowUntracked) {
      handleUntracked();
    } else {
      onClose();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      ref={popoverRef}
      className="timer-popover"
      onKeyDown={handleKeyDown}
    >
      <div className="timer-popover-header">
        <span>{headerText}</span>
      </div>
      <div className="timer-popover-content">
        <div className="timer-input-group">
          <label>Hours</label>
          <input
            type="number"
            min="0"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="timer-input"
            autoFocus
          />
        </div>
        <div className="timer-input-separator">:</div>
        <div className="timer-input-group">
          <label>Minutes</label>
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="timer-input"
          />
        </div>
        <div className="timer-input-separator">:</div>
        <div className="timer-input-group">
          <label>Seconds</label>
          <input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
            className="timer-input"
          />
        </div>
      </div>
      <div className="timer-popover-actions">
        <button 
          className="btn-popover-save"
          onClick={handleSave}
        >
          Save
        </button>
        {allowUntracked ? (
          <button
            className="btn-popover-untracked"
            onClick={handleUntracked}
          >
            {untrackedLabel}
          </button>
        ) : (
          <button 
            className="btn-popover-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
