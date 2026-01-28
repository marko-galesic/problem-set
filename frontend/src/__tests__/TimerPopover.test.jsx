import React, { createRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimerPopover from '../components/TimerPopover';

describe('TimerPopover', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('returns null when closed', () => {
    const { container } = render(<TimerPopover isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('saves time and closes', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    const triggerRef = createRef();
    triggerRef.current = document.createElement('span');

    render(
      <TimerPopover
        isOpen={true}
        currentTime={65000}
        onSave={onSave}
        onClose={onClose}
        triggerRef={triggerRef}
      />
    );

    const [hoursInput, minutesInput, secondsInput] = screen.getAllByRole('spinbutton');
    fireEvent.change(hoursInput, { target: { value: '1' } });
    fireEvent.change(minutesInput, { target: { value: '2' } });
    fireEvent.change(secondsInput, { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(onSave).toHaveBeenCalledWith(3723000);
    expect(onClose).toHaveBeenCalled();
  });

  it('handles invalid inputs and untracked', () => {
    const onClose = vi.fn();
    const onUntracked = vi.fn();
    const triggerRef = createRef();
    triggerRef.current = document.createElement('span');

    render(
      <TimerPopover
        isOpen={true}
        currentTime={0}
        onSave={() => {}}
        onClose={onClose}
        triggerRef={triggerRef}
        allowUntracked={true}
        onUntracked={onUntracked}
      />
    );

    const [, minutesInput] = screen.getAllByRole('spinbutton');
    fireEvent.change(minutesInput, { target: { value: '99' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(window.alert).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /untracked/i }));
    expect(onUntracked).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
