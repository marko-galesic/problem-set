import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StatsPanel from '../components/StatsPanel';

vi.mock('../utils/storage', () => ({
  getImplementations: vi.fn(() => [
    { id: '1', timestamp: new Date().toISOString(), passed: true, testCount: 2, avgTime: 10 }
  ]),
  getAverageTime: vi.fn(() => 10),
  clearImplementations: vi.fn()
}));

describe('StatsPanel', () => {
  it('renders stats and clears', () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
    render(<StatsPanel refreshTrigger={0} />);

    expect(screen.getByText(/total submissions/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10ms')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /clear all/i }));
    expect(window.confirm).toHaveBeenCalled();
  });
});
