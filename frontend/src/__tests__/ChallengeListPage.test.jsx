import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChallengeListPage from '../components/ChallengeListPage';

function createFetchMock() {
  return vi.fn(async (url) => {
    if (url.startsWith('/api/challenges/metadata')) {
      return {
        ok: true,
        json: async () => ({
          challenges: [
            {
              id: 'two_sum',
              name: 'Two Sum',
              difficulty: 'Easy',
              topics: ['arrays', 'hashing']
            },
            {
              id: 'binary_tree',
              name: 'Binary Tree',
              difficulty: 'Medium',
              topics: ['trees', 'dfs']
            }
          ]
        })
      };
    }

    if (url.startsWith('/api/submissions?scope=all')) {
      return {
        ok: true,
        json: async () => ({
          submissions: [{ id: 's1', challenge: 'two_sum' }],
          hasMore: false
        })
      };
    }

    return { ok: true, json: async () => ({}) };
  });
}

describe('ChallengeListPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', createFetchMock());
  });

  it('renders challenges and completion status', async () => {
    render(<ChallengeListPage />);

    expect(await screen.findByText('Two Sum')).toBeInTheDocument();
    expect(screen.getByText('Binary Tree')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Completed')).toHaveLength(1);
  });

  it('filters by difficulty and topic', async () => {
    render(<ChallengeListPage />);

    await screen.findByText('Two Sum');

    fireEvent.change(screen.getByLabelText(/difficulty/i), { target: { value: 'easy' } });

    await waitFor(() => {
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(screen.queryByText('Binary Tree')).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/difficulty/i), { target: { value: 'all' } });
    fireEvent.change(screen.getByLabelText(/topic/i), { target: { value: 'trees' } });

    await waitFor(() => {
      expect(screen.getByText('Binary Tree')).toBeInTheDocument();
      expect(screen.queryByText('Two Sum')).not.toBeInTheDocument();
    });
  });
});
