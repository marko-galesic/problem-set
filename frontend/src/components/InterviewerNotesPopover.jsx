import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';

export default function InterviewerNotesPopover({
  isConfirmOpen,
  isNotesOpen,
  onCancel,
  onConfirm,
  onClose,
  isLoading,
  error,
  notes
}) {
  return (
    <>
      <Dialog
        open={isConfirmOpen}
        onClose={onCancel}
        maxWidth={false}
        PaperProps={{ className: 'interviewer-confirm-popover' }}
      >
        <DialogTitle className="interviewer-popover-header">
          <span>Enable interviewer mode?</span>
          <IconButton onClick={onCancel} aria-label="Close" size="small">×</IconButton>
        </DialogTitle>
        <DialogContent className="interviewer-confirm-popover-content">
          <p><strong>Solution disclosure warning:</strong> these notes contain complete solutions, recurrences, scoring guidance, and expected insights.</p>
          <p>Do not continue while a candidate can see this screen.</p>
        </DialogContent>
        <DialogActions className="interviewer-popover-actions">
          <Button onClick={onCancel} type="button">Cancel</Button>
          <Button onClick={onConfirm} type="button" variant="contained">
            Show interviewer notes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isNotesOpen}
        onClose={onClose}
        maxWidth={false}
        PaperProps={{ className: 'interviewer-notes-popover' }}
      >
        <DialogTitle className="interviewer-popover-header">
          <span>Interviewer notes</span>
          <IconButton onClick={onClose} aria-label="Close" size="small">×</IconButton>
        </DialogTitle>
        <DialogContent className="interviewer-notes-popover-content">
          {isLoading && <p role="status">Loading interviewer notes...</p>}
          {!isLoading && error && <p role="alert" className="interviewer-notes-error">{error}</p>}
          {!isLoading && !error && notes && (
            <div
              className="interviewer-notes-html"
              dangerouslySetInnerHTML={{ __html: notes }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

