import React from 'react';

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
    <div className="language-switch-popover-overlay" onClick={onClose}>
      <div
        className="language-switch-popover"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="language-switch-popover-header">
          <span>{headerText}</span>
          <button
            className="btn btn--icon btn--ghost btn--muted language-switch-popover-close"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            x
          </button>
        </div>
        <div className="language-switch-popover-content">
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
        </div>
      </div>
    </div>
  );
}
