import { describe, expect, it, vi, afterEach } from 'vitest';
import { apiFetch } from '../api/client';

describe('apiFetch', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('uses same-origin credentials while preserving callers options', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await apiFetch('/api/submissions', { method: 'POST' });

    expect(fetchMock).toHaveBeenCalledWith('/api/submissions', {
      credentials: 'same-origin',
      method: 'POST'
    });
  });

  it('rejects requests outside the API namespace before network access', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    expect(() => apiFetch('/outside-api')).toThrow('/api/');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
