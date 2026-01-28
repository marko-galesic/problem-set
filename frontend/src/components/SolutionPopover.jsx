import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

export default function SolutionPopover({ isOpen, onClose, solution }) {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ className: 'solution-popover' }}
    >
      <DialogTitle className="solution-popover-header">
        <span>Submission Solution</span>
        <IconButton
          className="btn btn--icon btn--ghost btn--muted solution-popover-close"
          onClick={onClose}
          aria-label="Close"
          size="small"
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent className="solution-popover-content">
        <pre className="solution-code">
          {solution || 'Solution not available for this submission.'}
        </pre>
      </DialogContent>
    </Dialog>
  );
}
