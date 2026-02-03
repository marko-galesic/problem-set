import React from 'react';
import { Button, Popover } from '@mui/material';

export default function ResetPopover({
  isOpen,
  onClose,
  onResetSolution,
  onResetTimer
}) {
  if (!isOpen) {
    return null;
  }

  function handlePopoverClose() {
    if (onClose) {
      onClose();
    }
  }

  async function handleConfirmReset() {
    if (onResetTimer) {
      onResetTimer();
    }
    if (onResetSolution) {
      await onResetSolution();
    }
    if (onClose) {
      onClose();
    }
  }

  const anchorPosition = (() => {
    if (typeof window === 'undefined') {
      return { top: 0, left: 0 };
    }
    return {
      top: window.scrollY + window.innerHeight / 2,
      left: window.scrollX + window.innerWidth / 2
    };
  })();

  return (
    <Popover
      open={Boolean(isOpen)}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      onClose={handlePopoverClose}
      transformOrigin={{ vertical: 'center', horizontal: 'center' }}
      PaperProps={{ className: 'reset-popover' }}
    >
      <div className="reset-popover-header">
        <span>Reset solution and timer</span>
      </div>
      <div className="reset-popover-content">
        <div className="reset-popover-question">
          This will reset both your solution and the timer.
        </div>
        <div className="reset-popover-actions">
          <Button className="btn btn--sm btn--outline" onClick={handlePopoverClose} type="button">
            Cancel
          </Button>
          <Button className="btn btn--sm" onClick={handleConfirmReset} type="button">
            Confirm reset
          </Button>
        </div>
      </div>
    </Popover>
  );
}
