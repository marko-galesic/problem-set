import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { IconButton } from '@mui/material';
import TimerPopover from './TimerPopover';
import TimerAutoStartPopover from './TimerAutoStartPopover';

const AUTO_START_DELAY_MS = 60000;
const AUTO_START_TIME_MS = 60000;

const Timer = forwardRef(function Timer(props, ref) {
  const { 
    initialElapsedTime = 0, 
    initialIsRunning = false, 
    initialAccumulatedTime = 0,
    onStateChange
  } = props;
  
  const [elapsedTime, setElapsedTime] = useState(initialElapsedTime); // in milliseconds
  const [isRunning, setIsRunning] = useState(initialIsRunning);
  const [isVisible, setIsVisible] = useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAutoStartPopoverOpen, setIsAutoStartPopoverOpen] = useState(false);
  const startTimeRef = useRef(null);
  const accumulatedTimeRef = useRef(initialAccumulatedTime);
  const intervalRef = useRef(null);
  const onStateChangeRef = useRef(onStateChange);
  const timerDisplayRef = useRef(null);
  const autoStartTimeoutRef = useRef(null);
  const autoStartActiveRef = useRef(false);
  const autoStartSuppressedRef = useRef(false);

  // Update ref when callback changes
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  // Initialize from props when they change
  useEffect(() => {
    setElapsedTime(initialElapsedTime);
    setIsRunning(initialIsRunning);
    accumulatedTimeRef.current = initialAccumulatedTime;
    autoStartActiveRef.current = false;
    autoStartSuppressedRef.current = false;
    if (autoStartTimeoutRef.current) {
      clearTimeout(autoStartTimeoutRef.current);
      autoStartTimeoutRef.current = null;
    }
    setIsAutoStartPopoverOpen(false);
    if (initialIsRunning && initialAccumulatedTime > 0) {
      startTimeRef.current = Date.now() - initialAccumulatedTime;
    } else {
      startTimeRef.current = null;
    }
  }, [initialElapsedTime, initialIsRunning, initialAccumulatedTime]);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - accumulatedTimeRef.current;
      intervalRef.current = setInterval(() => {
        const newElapsedTime = Date.now() - startTimeRef.current;
        setElapsedTime(newElapsedTime);
        // Notify parent of state change
        // When running, save current elapsedTime as accumulatedTime since that's what it will be when paused
        if (onStateChangeRef.current) {
          onStateChangeRef.current(newElapsedTime, isRunning, newElapsedTime);
        }
      }, 10); // Update every 10ms for smooth display
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Calculate and save current elapsed time when pausing
      if (startTimeRef.current !== null) {
        accumulatedTimeRef.current = Date.now() - startTimeRef.current;
        setElapsedTime(accumulatedTimeRef.current);
        // Notify parent of state change
        if (onStateChangeRef.current) {
          onStateChangeRef.current(accumulatedTimeRef.current, isRunning, accumulatedTimeRef.current);
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    return () => {
      if (autoStartTimeoutRef.current) {
        clearTimeout(autoStartTimeoutRef.current);
        autoStartTimeoutRef.current = null;
      }
    };
  }, []);

  function cancelAutoStartTracking() {
    autoStartActiveRef.current = false;
    if (autoStartTimeoutRef.current) {
      clearTimeout(autoStartTimeoutRef.current);
      autoStartTimeoutRef.current = null;
    }
  }

  function showAutoStartPrompt() {
    cancelAutoStartTracking();
    setIsPopoverOpen(false);
    setIsAutoStartPopoverOpen(true);
  }

  function handleAutoStartConfirm() {
    setIsAutoStartPopoverOpen(false);
    autoStartSuppressedRef.current = false;
    handleSetTime(AUTO_START_TIME_MS, { resume: true });
  }

  function handleAutoStartDismiss() {
    setIsAutoStartPopoverOpen(false);
    autoStartSuppressedRef.current = true;
    handleSetTime(0, { resume: false });
  }

  function handleTypingDetected() {
    if (autoStartSuppressedRef.current || autoStartActiveRef.current || isAutoStartPopoverOpen) {
      return;
    }
    if (isRunning || elapsedTime > 0) {
      return;
    }

    autoStartActiveRef.current = true;
    if (autoStartTimeoutRef.current) {
      clearTimeout(autoStartTimeoutRef.current);
    }
    autoStartTimeoutRef.current = setTimeout(() => {
      if (!autoStartActiveRef.current) {
        return;
      }
      autoStartActiveRef.current = false;
      showAutoStartPrompt();
    }, AUTO_START_DELAY_MS);
  }

  function handleStartPause() {
    cancelAutoStartTracking();
    if (isAutoStartPopoverOpen) {
      setIsAutoStartPopoverOpen(false);
      autoStartSuppressedRef.current = false;
    }
    const newRunning = !isRunning;
    setIsRunning(newRunning);
    // State change will be notified in useEffect, but also notify immediately for running state
    if (onStateChangeRef.current) {
      onStateChangeRef.current(elapsedTime, newRunning, accumulatedTimeRef.current);
    }
  }

  function handleReset() {
    cancelAutoStartTracking();
    autoStartSuppressedRef.current = false;
    setIsAutoStartPopoverOpen(false);
    setIsRunning(false);
    setElapsedTime(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;
    // Notify parent of reset
    if (onStateChangeRef.current) {
      onStateChangeRef.current(0, false, 0);
    }
  }

  function handleToggleVisibility() {
    setIsVisible(!isVisible);
  }

  function handleTimerDisplayClick() {
    if (isAutoStartPopoverOpen) {
      return;
    }
    setIsPopoverOpen(true);
  }

  function handlePopoverClose() {
    setIsPopoverOpen(false);
  }

  function handlePopoverSave(newTime) {
    handleSetTime(newTime);
  }

  function handleSetTime(newTime, options = {}) {
    const { resume } = options;
    cancelAutoStartTracking();
    setIsAutoStartPopoverOpen(false);
    // Pause timer if running before setting time
    const wasRunning = isRunning;
    const shouldResume = resume === undefined ? wasRunning : resume;
    if (wasRunning) {
      setIsRunning(false);
    }

    // Update time values
    setElapsedTime(newTime);
    accumulatedTimeRef.current = newTime;
    
    // If timer was running, restart it with new time
    if (shouldResume) {
      startTimeRef.current = Date.now() - newTime;
      setIsRunning(true);
    } else {
      startTimeRef.current = null;
    }

    // Notify parent of state change
    if (onStateChangeRef.current) {
      onStateChangeRef.current(newTime, shouldResume, newTime);
    }
  }

  useImperativeHandle(ref, () => ({
    stop: () => {
      cancelAutoStartTracking();
      setIsAutoStartPopoverOpen(false);
      setIsRunning(false);
    },
    getElapsedTime: () => {
      return elapsedTime;
    },
    reset: () => {
      handleReset();
    },
    setTime: (newTime) => {
      handleSetTime(newTime);
    },
    notifyTyping: () => {
      handleTypingDetected();
    }
  }));

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return (
    <div className={`timer-container ${isVisible ? '' : 'timer-hidden'}`}>
      <div className="timer-icon-wrapper">
        <IconButton
          className="btn btn--icon-sm btn--ghost btn-timer-icon"
          onClick={handleToggleVisibility}
          title={isVisible ? 'Hide timer' : 'Show timer'}
          aria-label={isVisible ? 'Hide timer' : 'Show timer'}
          type="button"
        >
          <span className={`timer-icon ${isRunning ? 'pulsing' : ''}`}>
            ⏱️
          </span>
        </IconButton>
      </div>
      <div className="timer-display">
        <span 
          ref={timerDisplayRef}
          className="timer-time timer-time-clickable"
          onClick={handleTimerDisplayClick}
          title="Click to set time manually"
        >
          {formatTime(elapsedTime)}
        </span>
      </div>
      <div className="timer-controls">
        <IconButton 
          className="btn btn--icon-sm btn--ghost btn-timer-action"
          onClick={handleStartPause}
          title={isRunning ? 'Pause' : 'Start'}
          type="button"
        >
          {isRunning ? '⏸' : '▶'}
        </IconButton>
        <IconButton 
          className="btn btn--icon-sm btn--ghost btn-timer-reset"
          onClick={handleReset}
          title="Reset"
          type="button"
        >
          ↻
        </IconButton>
      </div>
      <TimerPopover
        isOpen={isPopoverOpen}
        onClose={handlePopoverClose}
        currentTime={elapsedTime}
        onSave={handlePopoverSave}
        triggerRef={timerDisplayRef}
      />
      <TimerAutoStartPopover
        isOpen={isAutoStartPopoverOpen}
        onConfirm={handleAutoStartConfirm}
        onDismiss={handleAutoStartDismiss}
      />
    </div>
  );
});

export default Timer;
