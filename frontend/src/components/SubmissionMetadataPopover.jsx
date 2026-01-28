import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';

const GUIDANCE_OPTIONS = ['Guided', 'Independent', 'Minor'];

export default function SubmissionMetadataPopover({
  isOpen,
  onClose,
  onSave,
  onUntracked,
  showTimerInputs = false,
  initialTimerTime = 0,
  initialGuidanceLevel = 'Independent',
  disabledGuidanceOptions = []
}) {
  const [guidanceLevel, setGuidanceLevel] = useState('Independent');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');

  function getDefaultGuidanceLevel(preferred) {
    if (preferred && !disabledGuidanceOptions.includes(preferred)) {
      return preferred;
    }
    if (!disabledGuidanceOptions.includes('Guided')) {
      return 'Guided';
    }
    return GUIDANCE_OPTIONS.find(option => !disabledGuidanceOptions.includes(option)) || 'Guided';
  }

  function msToTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return { hours: h, minutes: m, seconds: s };
  }

  function timeToMs(h, m, s) {
    return (h * 3600 + m * 60 + s) * 1000;
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setGuidanceLevel(getDefaultGuidanceLevel(initialGuidanceLevel || 'Independent'));
    if (showTimerInputs) {
      const time = msToTime(initialTimerTime || 0);
      setHours(time.hours.toString());
      setMinutes(time.minutes.toString());
      setSeconds(time.seconds.toString());
    }
  }, [isOpen, initialGuidanceLevel, initialTimerTime, showTimerInputs, disabledGuidanceOptions]);

  function handleSave() {
    let timerTime = initialTimerTime;
    if (showTimerInputs) {
      const h = parseInt(hours) || 0;
      const m = parseInt(minutes) || 0;
      const s = parseInt(seconds) || 0;
      if (m < 0 || m > 59 || s < 0 || s > 59 || h < 0) {
        alert('Invalid time values. Hours must be >= 0, minutes and seconds must be 0-59.');
        return;
      }
      timerTime = timeToMs(h, m, s);
    }
    const nextGuidanceLevel = disabledGuidanceOptions.includes(guidanceLevel)
      ? getDefaultGuidanceLevel('Guided')
      : guidanceLevel;
    if (onSave) {
      onSave(nextGuidanceLevel, timerTime);
    }
  }

  function handleUntracked() {
    const nextGuidanceLevel = disabledGuidanceOptions.includes(guidanceLevel)
      ? getDefaultGuidanceLevel('Guided')
      : guidanceLevel;
    if (onUntracked) {
      onUntracked(nextGuidanceLevel);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      handleSave();
    }
  }

  if (!isOpen) {
    return null;
  }

  function handleDialogClose(event, reason) {
    if (reason === 'escapeKeyDown' && showTimerInputs && onUntracked) {
      handleUntracked();
      return;
    }
    if (onClose) {
      onClose();
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleDialogClose}
      maxWidth={false}
      PaperProps={{ className: 'submission-metadata-popover', onKeyDown: handleKeyDown }}
    >
      <DialogTitle className="submission-metadata-popover-header">
        <span>Submission Details</span>
        <IconButton
          className="btn btn--icon btn--ghost btn--muted submission-metadata-popover-close"
          onClick={onClose}
          aria-label="Close"
          size="small"
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent className="submission-metadata-popover-content">
        <div className="guidance-selection">
          <div className="guidance-selection-label">Guidance</div>
          <RadioGroup
            className="guidance-options"
            row
            name="guidanceLevel"
            value={guidanceLevel}
            onChange={(event) => setGuidanceLevel(event.target.value)}
          >
            {GUIDANCE_OPTIONS.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
                disabled={disabledGuidanceOptions.includes(option)}
                className={`guidance-option ${disabledGuidanceOptions.includes(option) ? 'is-disabled' : ''}`}
              />
            ))}
          </RadioGroup>
        </div>

        {showTimerInputs && (
          <div className="submission-timer-section">
            <div className="submission-timer-label">Timer time</div>
            <div className="submission-timer-inputs">
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
          </div>
        )}
      </DialogContent>
      <DialogActions className="submission-metadata-popover-actions">
        <Button className="btn btn--sm btn-popover-save" onClick={handleSave} type="button">
          Save
        </Button>
        {showTimerInputs ? (
          <Button className="btn btn--sm btn-popover-untracked" onClick={handleUntracked} type="button">
            Untracked
          </Button>
        ) : (
          <Button className="btn btn--sm btn-popover-cancel" onClick={onClose} type="button">
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
