import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BugAnswerPopover from '../components/BugAnswerPopover';
import GuideConfirmPopover from '../components/GuideConfirmPopover';
import LanguageSwitchPopover from '../components/LanguageSwitchPopover';
import RecommendationPromptPopover from '../components/RecommendationPromptPopover';
import ProgressReportPopover from '../components/ProgressReportPopover';
import NextChallengePopover from '../components/NextChallengePopover';
import TopicFitnessCriteriaPopover from '../components/TopicFitnessCriteriaPopover';
import SolutionPopover from '../components/SolutionPopover';
import TimerAutoStartPopover from '../components/TimerAutoStartPopover';

describe('Popovers', () => {
  it('renders bug answer states', () => {
    const { rerender } = render(<BugAnswerPopover isOpen={false} />);
    expect(screen.queryByText(/where's the bug/i)).toBeNull();

    rerender(
      <BugAnswerPopover isOpen={true} isLoading={true} onClose={() => {}} />
    );
    expect(screen.getByText(/asking gpt-5/i)).toBeInTheDocument();

    rerender(
      <BugAnswerPopover isOpen={true} isLoading={false} error="Nope" onClose={() => {}} />
    );
    expect(screen.getByText('Nope')).toBeInTheDocument();

    rerender(
      <BugAnswerPopover
        isOpen={true}
        isLoading={false}
        answer="Use a map"
        note="Hint"
        onClose={() => {}}
      />
    );
    expect(screen.getByText(/use a map/i)).toBeInTheDocument();
    expect(screen.getByText('Hint')).toBeInTheDocument();
  });

  it('handles guide confirm actions', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(<GuideConfirmPopover isOpen={true} onClose={onClose} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders language switch text', () => {
    const { rerender } = render(
      <LanguageSwitchPopover isOpen={true} onClose={() => {}} fromLanguage="java" toLanguage="python" />
    );
    expect(screen.getByText(/switched from java to python/i)).toBeInTheDocument();

    rerender(
      <LanguageSwitchPopover isOpen={true} onClose={() => {}} fromLanguage="java" toLanguage="java" />
    );
    expect(screen.getByText(/language tracking/i)).toBeInTheDocument();
  });

  it('shows recommendation prompts', () => {
    render(
      <RecommendationPromptPopover
        isOpen={true}
        onClose={() => {}}
        systemPrompt="System"
        userPrompt="User"
      />
    );
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('renders progress report states', () => {
    const { rerender } = render(
      <ProgressReportPopover isOpen={true} isLoading={true} onClose={() => {}} />
    );
    expect(screen.getByText(/preparing your report/i)).toBeInTheDocument();

    rerender(
      <ProgressReportPopover isOpen={true} isLoading={false} error="Oops" onClose={() => {}} />
    );
    expect(screen.getByText('Oops')).toBeInTheDocument();

    rerender(
      <ProgressReportPopover isOpen={true} isLoading={false} report="Great job" onClose={() => {}} />
    );
    expect(screen.getByText(/great job/i)).toBeInTheDocument();

    rerender(
      <ProgressReportPopover isOpen={true} isLoading={false} report="" onClose={() => {}} />
    );
    expect(screen.getByText(/no report yet/i)).toBeInTheDocument();
  });

  it('renders next challenge popover states', () => {
    const { rerender } = render(
      <NextChallengePopover isOpen={true} isLoading={true} onClose={() => {}} />
    );
    expect(screen.getByText(/evaluating which challenge/i)).toBeInTheDocument();

    rerender(
      <NextChallengePopover isOpen={true} isLoading={false} error="Nope" onClose={() => {}} />
    );
    expect(screen.getByText('Nope')).toBeInTheDocument();

    const onContinue = vi.fn();
    rerender(
      <NextChallengePopover
        isOpen={true}
        isLoading={false}
        recommendation={{ name: 'Next', difficulty: 'Easy' }}
        nextChallengeId="next"
        countdown={3}
        onContinue={onContinue}
        onClose={() => {}}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('renders topic fitness criteria legend', () => {
    render(
      <TopicFitnessCriteriaPopover
        isOpen={true}
        onClose={() => {}}
        legend={[{ tier: 'Top', minutes: { Easy: 10, Hard: 20 } }]}
      />
    );
    expect(screen.getByText(/top/i)).toBeInTheDocument();
    expect(screen.getByText(/easy: 10 min/i)).toBeInTheDocument();
  });

  it('renders solution popover', () => {
    render(<SolutionPopover isOpen={true} onClose={() => {}} solution="answer" />);
    expect(screen.getByText(/submission solution/i)).toBeInTheDocument();
    expect(screen.getByText(/answer/i)).toBeInTheDocument();
  });

  it('handles timer autostart popover', () => {
    const onConfirm = vi.fn();
    const onDismiss = vi.fn();
    render(<TimerAutoStartPopover isOpen={true} onConfirm={onConfirm} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: /start timer/i }));
    fireEvent.click(screen.getByRole('button', { name: /not now/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('confirms timer autostart popover on enter', () => {
    const onConfirm = vi.fn();
    const onDismiss = vi.fn();
    render(<TimerAutoStartPopover isOpen={true} onConfirm={onConfirm} onDismiss={onDismiss} />);

    fireEvent.keyDown(screen.getByRole('button', { name: /start timer/i }), { key: 'Enter', code: 'Enter' });

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
