import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, CircularProgress } from '@mui/material';

export default function NextChallengePopover({
  isOpen,
  onClose,
  isLoading,
  error,
  recommendation,
  nextChallengeId,
  countdown,
  onContinue
}) {
  if (!isOpen) {
    return null;
  }

  const name = recommendation?.name || 'Unknown Challenge';
  const difficulty = recommendation?.difficulty;
  const showContinue = Boolean(nextChallengeId);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ className: 'next-challenge-popover' }}
    >
      <DialogTitle className="next-challenge-popover-header">
        <span>Next Challenge</span>
        <IconButton
          className="btn btn--icon btn--ghost btn--muted next-challenge-popover-close"
          onClick={onClose}
          aria-label="Close"
          size="small"
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent className="next-challenge-popover-content">
        {isLoading && (
          <div className="next-challenge-status">
            <CircularProgress size={16} />
            <span>Evaluating which challenge should be next</span>
          </div>
        )}
        {!isLoading && error && (
          <div className="next-challenge-error">{error}</div>
        )}
        {!isLoading && !error && (
          <>
            <div className="next-challenge-primary">
              <div className="next-challenge-name">{name}</div>
              {difficulty && (
                <div className="next-challenge-difficulty">{difficulty}</div>
              )}
            </div>
            {!showContinue && (
              <div className="next-challenge-note">
                Challenge not found in the current catalog.
              </div>
            )}
          </>
        )}
      </DialogContent>
      {!isLoading && !error && showContinue && (
        <DialogActions className="next-challenge-popover-actions">
          <Button
            className="btn btn--sm next-challenge-continue"
            type="button"
            onClick={onContinue}
          >
            Continue ({countdown})
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
