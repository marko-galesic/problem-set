import React from 'react';
import { Button, Popover } from '@mui/material';

export default function ResetPopover({
  isOpen,
  anchorEl,
  onClose,
  onResetSolution,
  onResetTimer
}) {
  if (!isOpen) {
    return null;
  }

  function handleResetSolution() {
    if (onResetSolution) {
      onResetSolution();
    }
    if (onClose) {
      onClose();
    }
  }

  function handleResetTimer() {
    if (onResetTimer) {
      onResetTimer();
    }
    if (onClose) {
      onClose();
    }
  }

  function handlePopoverClose() {
    if (onClose) {
      onClose();
    }
  }

  return (
    <Popover
      open={Boolean(isOpen && anchorEl)}
      anchorEl={anchorEl}
      onClose={handlePopoverClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      PaperProps={{ className: 'reset-popover' }}
    >
      <div className="reset-popover-header">
        <span>Reset options</span>
      </div>
      <div className="reset-popover-content">
        <div className="reset-popover-question">What would you like to reset?</div>
        <div className="reset-popover-actions">
          <Button className="btn btn--sm btn-reset-option" onClick={handleResetSolution} type="button">
            Reset solution
          </Button>
          <Button className="btn btn--sm btn-reset-option" onClick={handleResetTimer} type="button">
            Reset timer to zero (all progress will be cleared)
          </Button>
        </div>
      </div>
    </Popover>
  );
}
