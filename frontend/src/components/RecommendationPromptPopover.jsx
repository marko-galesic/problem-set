import React from 'react';

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
    <div className="recommendation-prompt-popover-overlay" onClick={onClose}>
      <div
        className="recommendation-prompt-popover"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="recommendation-prompt-popover-header">
          <span>Recommendation Prompts</span>
          <button
            className="recommendation-prompt-popover-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="recommendation-prompt-popover-content">
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
        </div>
      </div>
    </div>
  );
}
