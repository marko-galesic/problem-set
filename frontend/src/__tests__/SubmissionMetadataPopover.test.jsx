import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SubmissionMetadataPopover from '../components/SubmissionMetadataPopover';

describe('SubmissionMetadataPopover', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('renders and saves with timer inputs', () => {
    const onSave = vi.fn();
    render(
      <SubmissionMetadataPopover
        isOpen={true}
        onSave={onSave}
        showTimerInputs={true}
        initialTimerTime={65000}
        initialGuidanceLevel="Independent"
      />
    );

    const [hoursInput, minutesInput, secondsInput] = screen.getAllByRole('spinbutton');
    fireEvent.change(hoursInput, { target: { value: '0' } });
    fireEvent.change(minutesInput, { target: { value: '1' } });
    fireEvent.change(secondsInput, { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(onSave).toHaveBeenCalledWith('Independent', 65000);
  });

  it('handles invalid time and untracked', () => {
    const onSave = vi.fn();
    const onUntracked = vi.fn();
    render(
      <SubmissionMetadataPopover
        isOpen={true}
        onSave={onSave}
        onUntracked={onUntracked}
        showTimerInputs={true}
        initialTimerTime={0}
        disabledGuidanceOptions={['Independent']}
      />
    );

    const [, minutesInput] = screen.getAllByRole('spinbutton');
    fireEvent.change(minutesInput, { target: { value: '99' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(window.alert).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /untracked/i }));
    expect(onUntracked).toHaveBeenCalled();
  });
});
