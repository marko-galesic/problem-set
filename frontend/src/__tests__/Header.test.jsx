import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/Header';

vi.mock('../components/Timer', () => ({
  default: React.forwardRef(() => <div data-testid="timer" />)
}));

describe('Header', () => {
  it('renders actions and handles events', () => {
    const handlers = {
      onRun: vi.fn(),
      onSubmit: vi.fn(),
      onReset: vi.fn(),
      onToggleMaximize: vi.fn(),
      onChallengeChange: vi.fn(),
      onBugHunt: vi.fn(),
      onGuide: vi.fn(),
      onProgress: vi.fn()
    };

    render(
      <Header
        {...handlers}
        isRunning={false}
        isRunningRun={false}
        isRunningSubmit={false}
        isMaximized={false}
        currentChallenge="two_sum"
        challenges={[{ id: 'two_sum', name: 'Two Sum' }]}
        currentLanguage="java"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /run/i }));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    fireEvent.click(screen.getByRole('button', { name: /guide me/i }));
    fireEvent.click(screen.getByRole('button', { name: /your progress/i }));
    fireEvent.click(screen.getByRole('button', { name: /where's the bug/i }));

    expect(handlers.onRun).toHaveBeenCalled();
    expect(handlers.onSubmit).toHaveBeenCalled();
    expect(handlers.onReset).toHaveBeenCalled();
    expect(handlers.onGuide).toHaveBeenCalled();
    expect(handlers.onProgress).toHaveBeenCalled();
    expect(handlers.onBugHunt).toHaveBeenCalled();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'two_sum' } });
    expect(handlers.onChallengeChange).toHaveBeenCalledWith('two_sum');
  });

  it('disables actions while running', () => {
    render(
      <Header
        isRunning={true}
        isRunningRun={true}
        isRunningSubmit={true}
        isMaximized={true}
        currentChallenge="two_sum"
        challenges={[{ id: 'two_sum', name: 'Two Sum' }]}
        currentLanguage="java"
      />
    );

    expect(screen.getByRole('button', { name: /run/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /reset/i })).toBeDisabled();
  });
});
