import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TestCasesPreview from '../components/TestCasesPreview';

describe('TestCasesPreview', () => {
  it('renders collapsed state and toggles', () => {
    const onToggle = vi.fn();

    render(
      <TestCasesPreview
        isExpanded={false}
        onToggle={onToggle}
        testCases={[]}
      />
    );

    const toggleButton = screen.getByTitle('Show test cases');
    fireEvent.click(toggleButton);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders loading state when test cases are empty', () => {
    const onToggle = vi.fn();

    render(
      <TestCasesPreview
        isExpanded={true}
        onToggle={onToggle}
        testCases={[]}
      />
    );

    expect(screen.getByText(/loading test cases/i)).toBeInTheDocument();
    const hideButton = screen.getByTitle('Hide test cases');
    fireEvent.click(hideButton);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('switches between test cases and shows running state', () => {
    const onToggle = vi.fn();
    const testCases = [
      { id: 'a', name: 'Alpha', input: 'nums=[1,2]' },
      { id: 'b', name: 'Beta', input: 'nums=[3,4]' }
    ];

    render(
      <TestCasesPreview
        isExpanded={true}
        onToggle={onToggle}
        testCases={testCases}
        isRunning={true}
      />
    );

    expect(screen.getByText(/running/i)).toBeInTheDocument();
    expect(screen.getByText('nums=[1,2]')).toBeInTheDocument();

    const secondTab = screen.getByRole('button', { name: /test 2: beta/i });
    fireEvent.click(secondTab);

    expect(screen.getByText('nums=[3,4]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /test 2: beta/i })).toBeInTheDocument();
  });
});
