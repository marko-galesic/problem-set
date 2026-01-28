import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TestResults from '../components/TestResults';

const baseResults = [
  {
    passed: true,
    testCase: { id: 't1', name: 'Case A', input: 'nums=[1,2]' },
    expected: '3',
    actual: '3',
    executionTime: 5
  },
  {
    passed: false,
    testCase: { id: 't2', name: 'Case B', input: 'nums=[3,4]' },
    expected: '7',
    actual: '6',
    executionTime: 8,
    stdout: 'debug output',
    error: 'Mismatch'
  }
];

describe('TestResults', () => {
  it('returns null when there are no results', () => {
    const { container } = render(
      <TestResults
        results={[]}
        isExpanded={true}
        onToggle={() => {}}
      />
    );

    expect(container.innerHTML).toBe('');
  });

  it('renders collapsed state and toggles', () => {
    const onToggle = vi.fn();

    render(
      <TestResults
        results={baseResults}
        isExpanded={false}
        onToggle={onToggle}
      />
    );

    const toggleButton = screen.getByTitle('Show test results');
    fireEvent.click(toggleButton);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders summary and switches tabs', () => {
    const onToggle = vi.fn();

    render(
      <TestResults
        results={baseResults}
        totalTime={12}
        avgTime={6}
        isExpanded={true}
        onToggle={onToggle}
        actionType="run"
      />
    );

    expect(screen.getByText('1 / 2 tests passed')).toBeInTheDocument();
    expect(screen.getByText('Total time: 12ms')).toBeInTheDocument();
    expect(screen.getByText('Avg time: 6ms')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /test 1: case a/i })).toBeInTheDocument();

    const secondTab = screen.getByRole('tab', { name: /test 2: case b/i });
    fireEvent.click(secondTab);

    expect(screen.getByText('Mismatch')).toBeInTheDocument();
    expect(screen.getByText('debug output')).toBeInTheDocument();
    expect(
      screen.getByText(/the node structure created by your code did not match/i)
    ).toBeInTheDocument();
  });

  it('allows using a submit test case when not already included', () => {
    const onUseTestCase = vi.fn();

    render(
      <TestResults
        results={baseResults}
        isExpanded={true}
        onToggle={() => {}}
        actionType="submit"
        onUseTestCase={onUseTestCase}
      />
    );

    const secondTab = screen.getByRole('tab', { name: /test 2: case b/i });
    fireEvent.click(secondTab);

    const useButton = screen.getByRole('button', { name: /use this test case/i });
    fireEvent.click(useButton);

    expect(onUseTestCase).toHaveBeenCalledTimes(1);
    expect(onUseTestCase).toHaveBeenCalledWith(baseResults[1].testCase);
  });

  it('disables the use button when the test case is already in run', () => {
    render(
      <TestResults
        results={baseResults}
        isExpanded={true}
        onToggle={() => {}}
        actionType="submit"
        onUseTestCase={() => {}}
        baseRunTestIds={['t2']}
      />
    );

    const secondTab = screen.getByRole('tab', { name: /test 2: case b/i });
    fireEvent.click(secondTab);

    const useButton = screen.getByRole('button', { name: /already in run/i });
    expect(useButton).toBeDisabled();
  });
});
