import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

export default function TopicFitnessCriteriaPopover({ isOpen, onClose, legend = [] }) {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ className: 'topic-fitness-criteria-popover' }}
      aria-labelledby="topic-fitness-criteria-popover"
    >
      <DialogTitle className="topic-fitness-criteria-header" id="topic-fitness-criteria-popover">
        <span>Timer time goals</span>
        <IconButton
          className="btn btn--icon btn--ghost btn--muted topic-fitness-criteria-close"
          onClick={onClose}
          aria-label="Close"
          size="small"
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent className="topic-fitness-criteria-content">
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
      </DialogContent>
    </Dialog>
  );
}
