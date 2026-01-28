import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

export default function RecommendationPromptPopover({
  isOpen,
  onClose,
  systemPrompt,
  userPrompt
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ className: 'recommendation-prompt-popover' }}
    >
      <DialogTitle className="recommendation-prompt-popover-header">
        <span>Recommendation Prompts</span>
        <IconButton
          className="btn btn--icon btn--ghost btn--muted recommendation-prompt-popover-close"
          onClick={onClose}
          aria-label="Close"
          size="small"
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent className="recommendation-prompt-popover-content">
        <div className="recommendation-prompt-section">
          <div className="recommendation-prompt-label">System Prompt</div>
          <pre className="recommendation-prompt-text">
            {systemPrompt || 'System prompt not available.'}
          </pre>
        </div>
        <div className="recommendation-prompt-section">
          <div className="recommendation-prompt-label">User Prompt</div>
          <pre className="recommendation-prompt-text">
            {userPrompt || 'User prompt not available.'}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
