import React from 'react';

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
    <div className="next-challenge-popover-overlay" onClick={onClose}>
      <div
        className="next-challenge-popover"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="next-challenge-popover-header">
          <span>Next Challenge</span>
          <button
            className="btn btn--icon btn--ghost btn--muted next-challenge-popover-close"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="next-challenge-popover-content">
          {isLoading && (
            <div className="next-challenge-status">
              <span className="spinner" aria-hidden="true" />
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
        </div>
        {!isLoading && !error && showContinue && (
          <div className="next-challenge-popover-actions">
            <button
              className="btn btn--sm next-challenge-continue"
              type="button"
              onClick={onContinue}
            >
              Continue ({countdown})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
