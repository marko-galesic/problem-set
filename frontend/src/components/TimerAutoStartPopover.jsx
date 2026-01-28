import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';

export default function TimerAutoStartPopover({ isOpen, onConfirm, onDismiss }) {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onDismiss}
      maxWidth={false}
      PaperProps={{ className: 'timer-autostart-popover', 'aria-live': 'polite' }}
    >
      <DialogTitle className="timer-autostart-popover-header">
        <span>Start timer?</span>
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
          We tracked a minute while you were typing. Add it to the timer and start tracking now?
        </p>
      </DialogContent>
      <DialogActions className="timer-autostart-popover-actions">
        <Button className="btn btn--sm btn-popover-save" onClick={onConfirm} type="button">
          Start timer at 1:00
        </Button>
        <Button className="btn btn--sm btn-popover-cancel" onClick={onDismiss} type="button">
          Not now
        </Button>
      </DialogActions>
    </Dialog>
  );
}
