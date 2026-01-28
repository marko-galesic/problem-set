import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DescriptionPanel from '../components/DescriptionPanel';

describe('DescriptionPanel', () => {
  it('renders collapsed state and triggers toggle', () => {
    const onToggle = vi.fn();

    render(
      <DescriptionPanel
        isExpanded={false}
        onToggle={onToggle}
        description="<p>Example</p>"
      />
    );

    expect(screen.queryByRole('heading', { name: /problem description/i })).toBeNull();
    const toggleButton = screen.getByTitle('Show description');
    fireEvent.click(toggleButton);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders expanded state with description and fallback', () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <DescriptionPanel
        isExpanded={true}
        onToggle={onToggle}
        description="<p>Hello world</p>"
      />
    );

    expect(screen.getByRole('heading', { name: /problem description/i })).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();

    const hideButton = screen.getByTitle('Hide description');
    fireEvent.click(hideButton);
    expect(onToggle).toHaveBeenCalledTimes(1);

    rerender(
      <DescriptionPanel
        isExpanded={true}
        onToggle={onToggle}
        description=""
      />
    );

    expect(screen.getByText(/loading description/i)).toBeInTheDocument();
  });
});
