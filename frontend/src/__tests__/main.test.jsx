import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

vi.mock('../App', () => ({
  default: () => <div>app-view</div>
}));
vi.mock('../components/SubmissionsPage', () => ({
  default: () => <div>submissions-view</div>
}));

const loadMain = async () => {
  await import('../main.jsx');
};

describe('main', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({}) })));
  });

  it('renders app by default', async () => {
    window.location.hash = '';
    await loadMain();

    expect(await screen.findByText('app-view')).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalled());
  });

  it('renders submissions for hash route', async () => {
    vi.resetModules();
    document.body.innerHTML = '<div id="root"></div>';
    window.location.hash = '#/submissions';

    await loadMain();

    expect(await screen.findByText('submissions-view')).toBeInTheDocument();
  });
});
