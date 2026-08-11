const API_PREFIX = '/api/';

export function apiFetch(path, options = {}) {
  if (typeof path !== 'string' || !path.startsWith(API_PREFIX)) {
    throw new TypeError('API requests must use an /api/ path');
  }

  return fetch(path, {
    credentials: 'same-origin',
    ...options
  });
}
