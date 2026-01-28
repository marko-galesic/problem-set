import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';

export default function GuideConfirmPopover({ isOpen, onClose, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ className: 'guide-confirm-popover' }}
    >
      <DialogTitle className="guide-confirm-popover-header">
        <span>Guide me</span>
        <IconButton
          className="btn btn--icon btn--ghost btn--muted guide-confirm-popover-close"
          onClick={onClose}
          aria-label="Close"
          size="small"
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent className="guide-confirm-popover-content">
        <p>
          Guide me opens a chat with an AI teacher to help you reach the solution.
        </p>
        <p>
          Continuing will mark your submission as Guided and lock the other guidance options.
        </p>
        <p>Do you want to continue?</p>
      </DialogContent>
      <DialogActions className="guide-confirm-popover-actions">
        <Button className="btn btn--sm btn-popover-save" onClick={onConfirm} type="button">
          Continue
        </Button>
        <Button className="btn btn--sm btn-popover-cancel" onClick={onClose} type="button">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
