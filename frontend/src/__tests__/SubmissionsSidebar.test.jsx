import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SubmissionsSidebar from '../components/SubmissionsSidebar';

vi.mock('../components/TimerPopover', () => ({
  default: ({ isOpen, onSave, currentTime }) =>
    isOpen ? (
      <button type="button" onClick={() => onSave(currentTime + 1000)}>
        save-popover
      </button>
    ) : null
}));

vi.mock('../components/SolutionPopover', () => ({
  default: ({ isOpen, solution }) => (isOpen ? <div>{solution}</div> : null)
}));

describe('SubmissionsSidebar', () => {
  it('renders collapsed state and toggles', () => {
    const onToggle = vi.fn();
    render(<SubmissionsSidebar isExpanded={false} onToggle={onToggle} submissions={[]} />);
    fireEvent.click(screen.getByTitle('Show submissions'));
    expect(onToggle).toHaveBeenCalled();
  });

  it('renders submissions and handles delete/update', () => {
    const onDelete = vi.fn();
    const onUpdateSubmission = vi.fn();
    const submission = {
      id: '1',
      date: new Date().toISOString(),
      avgTime: 10,
      timerTime: 5000,
      submitAttempts: 2,
      guidanceLevel: 'Independent',
      solution: 'solution code'
    };

    render(
      <SubmissionsSidebar
        isExpanded={true}
        onToggle={() => {}}
        submissions={[submission]}
        onDelete={onDelete}
        onUpdateSubmission={onUpdateSubmission}
      />
    );

    fireEvent.click(screen.getByTitle('Delete submission'));
    expect(onDelete).toHaveBeenCalledWith('1');

    fireEvent.click(screen.getByTitle('Click to edit timer time'));
    fireEvent.click(screen.getByText('save-popover'));
    expect(onUpdateSubmission).toHaveBeenCalledWith('1', 6000);

    fireEvent.click(screen.getByText(/solution code/i));
  });
});
