import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/Header';

vi.mock('../components/Timer', () => ({
  default: React.forwardRef(() => <div data-testid="timer" />)
}));

describe('Header', () => {
  it('renders actions and handles events', async () => {
    const handlers = {
      onRun: vi.fn(),
      onSubmit: vi.fn(),
      onResetSolution: vi.fn(),
      onResetTimer: vi.fn(),
      onToggleMaximize: vi.fn(),
      onBugHunt: vi.fn(),
      onGuide: vi.fn(),
      onInterviewerNotes: vi.fn(),
      onProgress: vi.fn(),
      onLanguageChange: vi.fn()
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
        availableLanguages={['java', 'python', 'javascript', 'typescript', 'cpp']}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /run/i }));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    fireEvent.click(screen.getByRole('button', { name: /guide me/i }));
    fireEvent.click(screen.getByRole('button', { name: /interviewer notes/i }));
    fireEvent.click(screen.getByRole('button', { name: /your progress/i }));
    fireEvent.click(screen.getByRole('button', { name: /where's the bug/i }));
    fireEvent.change(screen.getByRole('combobox', { name: /language/i }), { target: { value: 'cpp' } });
    expect(screen.getByRole('link', { name: /challenges/i })).toHaveAttribute('href', '/#/challenges');
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    fireEvent.click(await screen.findByRole('button', { name: /confirm reset/i }));

    expect(handlers.onRun).toHaveBeenCalled();
    expect(handlers.onSubmit).toHaveBeenCalled();
    expect(handlers.onResetSolution).toHaveBeenCalled();
    expect(handlers.onResetTimer).toHaveBeenCalled();
    expect(handlers.onGuide).toHaveBeenCalled();
    expect(handlers.onInterviewerNotes).toHaveBeenCalled();
    expect(handlers.onProgress).toHaveBeenCalled();
    expect(handlers.onBugHunt).toHaveBeenCalled();
    expect(handlers.onLanguageChange).toHaveBeenCalledWith('cpp');
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
        availableLanguages={['java', 'python', 'javascript', 'typescript']}
        onLanguageChange={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /run/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /reset/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /interviewer notes/i })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: /language/i })).toBeDisabled();
  });
});
