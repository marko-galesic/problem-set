import React from 'react';

export default function TopicFitnessCriteriaPopover({ isOpen, onClose, legend = [] }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="topic-fitness-criteria-popover-overlay" onClick={onClose}>
      <div
        className="topic-fitness-criteria-popover"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Timer time goals"
        id="topic-fitness-criteria-popover"
      >
        <div className="topic-fitness-criteria-header">
          <span>Timer time goals</span>
          <button
            className="topic-fitness-criteria-close"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            x
          </button>
        </div>
        <div className="topic-fitness-criteria-content">
          <p className="topic-fitness-criteria-subtitle">Reference targets by difficulty</p>
          <div className="submissions-legend-grid">
            {legend.map((entry) => (
              <div key={entry.tier} className="submissions-legend-card">
                <div className="submissions-legend-tier">{entry.tier}</div>
                <div className="submissions-legend-pills">
                  {Object.entries(entry.minutes).map(([difficulty, minutes]) => (
                    <span
                      key={difficulty}
                      className={`submissions-legend-pill ${difficulty.toLowerCase()}`}
                    >
                      {difficulty}: {minutes} min
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
