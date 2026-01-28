import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveImplementation,
  getImplementations,
  clearImplementations,
  getAverageTime,
  saveDividerPosition,
  getDividerPosition,
  saveEditorMaximized,
  getEditorMaximized,
  saveVerticalDividerPosition,
  getVerticalDividerPosition,
  saveCurrentCode,
  getCurrentCode,
  saveLanguagePreference,
  getLanguagePreference,
  getSubmitAttempts,
  incrementSubmitAttempts,
  resetSubmitAttempts,
  saveTimerState,
  getTimerState,
  saveSubmission,
  getSubmissions,
  deleteSubmission,
  updateSubmission
} from '../utils/storage';

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('crypto', { randomUUID: () => 'uuid-1' });
  });

  it('saves and retrieves implementations and average time', () => {
    const impl = saveImplementation('code', 12, 2, true, 'two_sum', 'java');
    expect(impl.id).toBe('uuid-1');
    const implementations = getImplementations('two_sum', 'java');
    expect(implementations).toHaveLength(1);
    expect(getAverageTime('two_sum', 'java')).toBe(12);

    saveImplementation('code2', 18, 2, false, 'two_sum', 'java');
    expect(getAverageTime('two_sum', 'java')).toBe(15);

    clearImplementations('two_sum', 'java');
    expect(getImplementations('two_sum', 'java')).toEqual([]);
  });

  it('handles invalid implementations JSON', () => {
    localStorage.setItem('two_sum_java_implementations', 'not-json');
    expect(getImplementations('two_sum', 'java')).toEqual([]);
  });

  it('saves divider positions and editor state', () => {
    saveDividerPosition(42, 'two_sum');
    expect(getDividerPosition('two_sum')).toBe(42);

    localStorage.setItem('two_sum_divider_position', 'nan');
    expect(getDividerPosition('two_sum')).toBeNull();

    saveEditorMaximized(true, 'two_sum');
    expect(getEditorMaximized('two_sum')).toBe(true);

    saveVerticalDividerPosition(30, 'two_sum');
    expect(getVerticalDividerPosition('two_sum')).toBe(30);
  });

  it('saves and retrieves current code', () => {
    saveCurrentCode('hello', 'two_sum', 'python');
    expect(getCurrentCode('two_sum', 'python')).toBe('hello');
  });

  it('increments and resets submit attempts', () => {
    expect(getSubmitAttempts('two_sum', 'java')).toBe(0);
    expect(incrementSubmitAttempts('two_sum', 'java')).toBe(1);
    expect(incrementSubmitAttempts('two_sum', 'java')).toBe(2);
    resetSubmitAttempts('two_sum', 'java');
    expect(getSubmitAttempts('two_sum', 'java')).toBe(0);
  });

  it('saves and loads timer state', () => {
    saveTimerState('two_sum', 1200, true, 1200, 'java');
    expect(getTimerState('two_sum', 'java')).toEqual({
      elapsedTime: 1200,
      isRunning: true,
      accumulatedTime: 1200
    });

    localStorage.setItem('two_sum_timer_state', 'bad');
    expect(getTimerState('two_sum')).toBeNull();
  });

  it('handles language preference API calls', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ language: 'python' }) });
    expect(await saveLanguagePreference('python')).toBe('python');

    fetch.mockResolvedValueOnce({ ok: false });
    expect(await saveLanguagePreference('java')).toBeNull();

    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ language: 'javascript' }) });
    expect(await getLanguagePreference()).toBe('javascript');

    fetch.mockResolvedValueOnce({ ok: false });
    expect(await getLanguagePreference()).toBeNull();
  });

  it('handles submissions APIs', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ submission: { id: 1 } }) });
    const saved = await saveSubmission('two_sum', 5, 10, 'solution', 'Independent', 1, 'java');
    expect(saved).toEqual({ id: 1 });

    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ submissions: [{ id: 2 }] }) });
    expect(await getSubmissions('two_sum')).toEqual([{ id: 2 }]);

    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });
    expect(await deleteSubmission(3, 'two_sum')).toEqual({ success: true });

    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ submission: { id: 4 } }) });
    expect(await updateSubmission(4, 5000, 'two_sum')).toEqual({ id: 4 });
  });

  it('propagates submission API errors', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(saveSubmission('two_sum', 5, 10, 'solution', 'Independent', 1, 'java')).rejects.toThrow(
      'Failed to save submission'
    );

    fetch.mockResolvedValueOnce({ ok: false });
    await expect(getSubmissions('two_sum')).resolves.toEqual([]);

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Nope' })
    });
    await expect(deleteSubmission(3, 'two_sum')).rejects.toThrow('Nope');

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Bad update' })
    });
    await expect(updateSubmission(4, 5000, 'two_sum')).rejects.toThrow('Bad update');
  });
});
