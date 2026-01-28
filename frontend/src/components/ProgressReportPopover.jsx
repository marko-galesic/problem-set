import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

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
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ className: 'progress-report-popover' }}
    >
      <DialogTitle className="progress-report-popover-header">
        <span>Your Progress</span>
        <IconButton
          className="btn btn--icon btn--ghost btn--muted progress-report-popover-close"
          onClick={onClose}
          aria-label="Close"
          size="small"
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent className="progress-report-popover-content">
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
      </DialogContent>
    </Dialog>
  );
}
