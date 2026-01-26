import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ProgressReportPopover({
  isOpen,
  onClose,
  isLoading,
  error,
  report
}) {
  if (!isOpen) {
    return null;
  }

  const hasReport = Boolean(report);

  return (
    <div className="progress-report-popover-overlay" onClick={onClose}>
      <div
        className="progress-report-popover"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="progress-report-popover-header">
          <span>Your Progress</span>
          <button
            className="progress-report-popover-close"
            onClick={onClose}
            aria-label="Close"
          >
            x
          </button>
        </div>
        <div className="progress-report-popover-content">
          {isLoading && (
            <div className="progress-report-popover-status">
              Preparing your report...
            </div>
          )}
          {!isLoading && error && (
            <div className="progress-report-popover-error">
              {error}
            </div>
          )}
          {!isLoading && !error && hasReport && (
            <div className="progress-report-popover-report">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          )}
          {!isLoading && !error && !hasReport && (
            <div className="progress-report-popover-status">
              No report yet. Reports are available after 4pm on days you submit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
