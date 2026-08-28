import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import InterviewerNotesPopover from '../components/InterviewerNotesPopover';

const baseProps = {
  isConfirmOpen: false,
  isNotesOpen: false,
  onCancel: vi.fn(),
  onConfirm: vi.fn(),
  onClose: vi.fn(),
  isLoading: false,
  error: '',
  notes: ''
};

describe('InterviewerNotesPopover', () => {
  it('shows a solution-disclosure warning before confirmation', () => {
    const onConfirm = vi.fn();
    render(<InterviewerNotesPopover {...baseProps} isConfirmOpen onConfirm={onConfirm} />);

    expect(screen.getByText(/solution disclosure warning/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /show interviewer notes/i }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('renders trusted notes in a separate dialog without a candidate description', () => {
    render(
      <InterviewerNotesPopover
        {...baseProps}
        isNotesOpen
        notes="<h2>Scoring rubric</h2><p>Expected insight</p>"
      />
    );

    expect(screen.getByRole('dialog')).toHaveTextContent('Scoring rubric');
    expect(screen.getByRole('dialog')).toHaveTextContent('Expected insight');
    expect(screen.queryByText('Problem Description')).not.toBeInTheDocument();
  });

  it('renders missing-notes errors inside the notes dialog', () => {
    render(
      <InterviewerNotesPopover
        {...baseProps}
        isNotesOpen
        error="Interviewer notes are not available for this challenge."
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('not available');
  });
});

