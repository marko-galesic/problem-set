import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import SubmissionsPage from '../components/SubmissionsPage';

vi.mock('../components/RecommendationPromptPopover', () => ({
  default: ({ isOpen }) => (isOpen ? <div data-testid="prompt-popover" /> : null)
}));
vi.mock('../components/LanguageSwitchPopover', () => ({
  default: ({ isOpen }) => (isOpen ? <div data-testid="language-popover" /> : null)
}));
vi.mock('../components/TopicFitnessCriteriaPopover', () => ({
  default: ({ isOpen }) => (isOpen ? <div data-testid="criteria-popover" /> : null)
}));

vi.mock('../utils/storage', () => ({
  getLanguagePreference: vi.fn(async () => 'java'),
  saveLanguagePreference: vi.fn(async () => 'python'),
  saveNextChallengeRecommendation: vi.fn()
}));

function createFetchMock() {
  return vi.fn(async (input, init) => {
    const url = typeof input === 'string' ? input : input.url;

    if (url.startsWith('/api/challenges/metadata')) {
      return {
        ok: true,
        json: async () => ({ challenges: [{ id: 'two_sum', name: 'Two Sum', difficulty: 'Easy' }] })
      };
    }

    if (url.startsWith('/api/challenges')) {
      return {
        ok: true,
        json: async () => ({ challenges: [{ id: 'two_sum', name: 'Two Sum' }] })
      };
    }

    if (url.startsWith('/api/topic-fitness')) {
      return {
        ok: true,
        json: async () => ({ topics: [] })
      };
    }

    if (url.startsWith('/api/submissions?')) {
      return {
        ok: true,
        json: async () => ({
          submissions: [
            {
              id: 'sub-1',
              challenge: 'two_sum',
              date: new Date().toISOString(),
              avgTime: 12,
              timerTime: 5000,
              submitAttempts: 2,
              guidanceLevel: 'Independent',
              techBarLabel: 'None'
            }
          ],
          total: 1,
          hasMore: false
        })
      };
    }

    if (url === '/api/recommend-next-challenge') {
      return {
        ok: true,
        json: async () => ({
          name: 'Next Challenge',
          difficulty: 'Medium',
          explanation: 'Keep going',
          systemPrompt: 'sys',
          userPrompt: 'user'
        })
      };
    }

    return { ok: true, json: async () => ({}) };
  });
}

describe('SubmissionsPage', () => {
  beforeEach(() => {
    const fetchMock = createFetchMock();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock'),
      revokeObjectURL: vi.fn()
    });
  });

  it('renders submissions table and handles interactions', async () => {
    render(<SubmissionsPage />);

    expect(await screen.findByText(/next challenge recommendation/i)).toBeInTheDocument();
    expect(screen.getByText(/all submissions/i)).toBeInTheDocument();

    fireEvent.click(await screen.findByRole('button', { name: /show details/i }));
    fireEvent.click(await screen.findByRole('button', { name: /keep going/i }));
    expect(screen.getByTestId('prompt-popover')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /show criteria/i }));
    expect(screen.getByTestId('criteria-popover')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /submissions/i }));
    expect(await screen.findByText(/two sum/i)).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'python' } });
    expect(await screen.findByTestId('language-popover')).toBeInTheDocument();

    const exportButton = screen.getByRole('button', { name: /export csv/i });
    fireEvent.click(exportButton);
    await waitFor(() => expect(URL.createObjectURL).toHaveBeenCalled());
  });

  it('shows submission errors', async () => {
    const failingFetch = vi.fn(async (input) => {
      const url = typeof input === 'string' ? input : input.url;
      if (url.startsWith('/api/challenges/metadata')) {
        return { ok: true, json: async () => ({ challenges: [] }) };
      }
      if (url.startsWith('/api/submissions?')) {
        return { ok: false };
      }
      return { ok: true, json: async () => ({}) };
    });

    vi.stubGlobal('fetch', failingFetch);

    render(<SubmissionsPage />);
    fireEvent.click(await screen.findByRole('tab', { name: /submissions/i }));
    expect(await screen.findByText(/failed to load submissions/i)).toBeInTheDocument();
  });

  it('shows topic fitness grade popover with submissions and avg timer time', async () => {
    const popoverFetch = vi.fn(async (input) => {
      const url = typeof input === 'string' ? input : input.url;

      if (url.startsWith('/api/challenges/metadata')) {
        return {
          ok: true,
          json: async () => ({
            challenges: [
              {
                id: 'two_sum',
                name: 'Two Sum',
                difficulty: 'Easy',
                topics: ['Arrays']
              }
            ]
          })
        };
      }

      if (url.startsWith('/api/challenges')) {
        return {
          ok: true,
          json: async () => ({ challenges: [{ id: 'two_sum', name: 'Two Sum' }] })
        };
      }

      if (url.startsWith('/api/topic-fitness')) {
        return {
          ok: true,
          json: async () => ({
            topics: [
              {
                topic: 'Arrays',
                easy: { fitness: 0.95, submissionCount: 2 },
                medium: { fitness: 0, submissionCount: 0 },
                hard: { fitness: 0, submissionCount: 0 }
              }
            ]
          })
        };
      }

      if (url.startsWith('/api/submissions?')) {
        return {
          ok: true,
          json: async () => ({
            submissions: [
              {
                id: 'sub-1',
                challenge: 'two_sum',
                date: new Date().toISOString(),
                avgTime: 12,
                timerTime: 60000,
                submitAttempts: 1,
                guidanceLevel: 'Independent',
                techBarLabel: 'None',
                language: 'java'
              },
              {
                id: 'sub-2',
                challenge: 'two_sum',
                date: new Date().toISOString(),
                avgTime: 18,
                timerTime: 120000,
                submitAttempts: 1,
                guidanceLevel: 'Independent',
                techBarLabel: 'None',
                language: 'java'
              }
            ],
            total: 2,
            hasMore: false
          })
        };
      }

      if (url === '/api/recommend-next-challenge') {
        return {
          ok: true,
          json: async () => ({
            name: 'Next Challenge',
            difficulty: 'Medium',
            explanation: 'Keep going',
            systemPrompt: 'sys',
            userPrompt: 'user'
          })
        };
      }

      return { ok: true, json: async () => ({}) };
    });

    vi.stubGlobal('fetch', popoverFetch);

    render(<SubmissionsPage />);

    const grade = await screen.findByText('A', { selector: '.topic-fitness-grade' });
    fireEvent.mouseEnter(grade);

    expect(await screen.findByText(/avg timer time/i)).toBeInTheDocument();
    expect(screen.getByText('01:30')).toBeInTheDocument();

    const popover = await waitFor(() => document.querySelector('.topic-fitness-grade-popover'));
    expect(popover).toBeTruthy();
    expect(within(popover).getByText('2')).toBeInTheDocument();
  });
});
