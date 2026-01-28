import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

export default function BugAnswerPopover({
  isOpen,
  onClose,
  isLoading,
  error,
  answer,
  note
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ className: 'bug-answer-popover' }}
    >
      <DialogTitle className="bug-answer-popover-header">
        <span>Where&apos;s the bug?</span>
        <IconButton
          className="btn btn--icon btn--ghost btn--muted bug-answer-popover-close"
          onClick={onClose}
          aria-label="Close"
          size="small"
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent className="bug-answer-popover-content">
        {isLoading && (
          <div className="bug-answer-popover-status">
            Asking GPT-5 for a hint...
          </div>
        )}
        {!isLoading && error && (
          <div className="bug-answer-popover-error">
            {error}
          </div>
        )}
        {!isLoading && !error && (
          <>
            <div className="bug-answer-popover-answer">
              <ReactMarkdown>{answer || 'No answer returned.'}</ReactMarkdown>
            </div>
            {note && (
              <div className="bug-answer-popover-note">
                {note}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
