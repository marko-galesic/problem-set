import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

export default function LanguageSwitchPopover({
  isOpen,
  onClose,
  fromLanguage,
  toLanguage
}) {
  if (!isOpen) {
    return null;
  }

  const headerText = fromLanguage && toLanguage && fromLanguage !== toLanguage
    ? `Switched from ${fromLanguage} to ${toLanguage}`
    : 'Language tracking';
  const selectedLanguage = toLanguage || 'this language';

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ className: 'language-switch-popover' }}
    >
      <DialogTitle className="language-switch-popover-header">
        <span>{headerText}</span>
        <IconButton
          className="btn btn--icon btn--ghost btn--muted language-switch-popover-close"
          onClick={onClose}
          aria-label="Close"
          size="small"
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent className="language-switch-popover-content">
        <p>
          Switching languages recalculates topic fitness and recommendations for {selectedLanguage}.
          Each submission is weighted by:
        </p>
        <ul>
          <li>Guidance level (Independent counts more than Guided)</li>
          <li>Submit attempts</li>
          <li>Time (avg runtime or timer time)</li>
          <li>Recency (newer work counts more)</li>
        </ul>
        <p>
          Topic fitness uses your {selectedLanguage} submissions plus discounted carryover from
          similar languages. That carryover starts small and grows as you submit more in {selectedLanguage}.
        </p>
        <p>
          Next challenge recommendations use your {selectedLanguage} submissions and topic fitness
          to emphasize weaker topics and appropriate difficulty.
        </p>
      </DialogContent>
    </Dialog>
  );
}
