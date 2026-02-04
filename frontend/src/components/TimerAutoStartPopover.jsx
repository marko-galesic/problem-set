import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';

export default function TimerAutoStartPopover({ isOpen, onConfirm, onDismiss, mode = 'start' }) {
  if (!isOpen) {
    return null;
  }

  const isResume = mode === 'resume';
  const titleText = isResume ? 'Resume timer?' : 'Start timer?';
  const messageText = isResume
    ? 'We tracked a minute while you were typing. Add it to the timer and resume tracking now?'
    : 'We tracked a minute while you were typing. Add it to the timer and start tracking now?';
  const confirmLabel = isResume ? 'Resume timer (+1:00)' : 'Start timer at 1:00';

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      onConfirm();
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onDismiss}
      onKeyDown={handleKeyDown}
      maxWidth={false}
      PaperProps={{ className: 'timer-autostart-popover', 'aria-live': 'polite' }}
    >
      <DialogTitle className="timer-autostart-popover-header">
        <span>{titleText}</span>
        <IconButton
          className="btn btn--icon btn--ghost btn--muted timer-autostart-popover-close"
          onClick={onDismiss}
          aria-label="Close"
          size="small"
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent className="timer-autostart-popover-content">
        <p>
          {messageText}
        </p>
      </DialogContent>
      <DialogActions className="timer-autostart-popover-actions">
        <Button className="btn btn--sm btn-popover-save" onClick={onConfirm} type="button">
          {confirmLabel}
        </Button>
        <Button className="btn btn--sm btn-popover-cancel" onClick={onDismiss} type="button">
          Not now
        </Button>
      </DialogActions>
    </Dialog>
  );
}
