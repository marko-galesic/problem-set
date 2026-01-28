import React, { createRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Timer from '../components/Timer';

vi.mock('../components/TimerPopover', () => ({
  default: ({ isOpen, onSave }) =>
    isOpen ? (
      <button type="button" onClick={() => onSave(5000)}>
        save-time
      </button>
    ) : null
}));

vi.mock('../components/TimerAutoStartPopover', () => ({
  default: ({ isOpen, onConfirm, onDismiss }) =>
    isOpen ? (
      <div>
        <span>auto-start</span>
        <button type="button" onClick={onConfirm}>
          confirm
        </button>
        <button type="button" onClick={onDismiss}>
          dismiss
        </button>
      </div>
    ) : null
}));

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('starts, pauses, resets, and sets time', () => {
    const onStateChange = vi.fn();
    render(<Timer onStateChange={onStateChange} />);

    const startButton = screen.getByTitle('Start');
    fireEvent.click(startButton);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(onStateChange).toHaveBeenCalled();
    expect(screen.getByTitle('Pause')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Pause'));
    fireEvent.click(screen.getByTitle('Reset'));
    expect(screen.getByText('00:00')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Click to set time manually'));
    fireEvent.click(screen.getByText('save-time'));
    expect(screen.getByText('00:05')).toBeInTheDocument();
  });

  it('triggers auto start prompt via ref', () => {
    const ref = createRef();
    render(<Timer ref={ref} />);

    act(() => {
      ref.current.notifyTyping();
      vi.advanceTimersByTime(60000);
    });

    expect(screen.getByText('auto-start')).toBeInTheDocument();
    fireEvent.click(screen.getByText('confirm'));

    expect(screen.getByText('01:00')).toBeInTheDocument();
  });
});
