import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { createApiSecurity, createCorsOptions, resetApiSecurityState } from '../../security/apiSecurity.js';

const originalNodeEnv = process.env.NODE_ENV;
const request = ({ path = '/api/run', method = 'GET', authorization, ip = '198.51.100.42' } = {}) => ({ path, method, ip, get: (name) => (name === 'authorization' ? authorization : undefined) });
const response = () => { const value = {}; value.set = jest.fn(() => value); value.status = (code) => { value.statusCode = code; return value; }; value.json = (body) => { value.body = body; return value; }; return value; };
afterEach(() => { process.env.NODE_ENV = originalNodeEnv; resetApiSecurityState(); });

describe('API security boundary', () => {
  it('fails closed when production authentication is not configured', () => { process.env.NODE_ENV = 'production'; expect(() => createApiSecurity({ token: '' })).toThrow('SITE_AUTH_TOKEN'); });
  it('requires a matching bearer token outside tests', () => {
    process.env.NODE_ENV = 'development'; const middleware = createApiSecurity({ token: 'correct-token' }); const denied = response(); const next = jest.fn();
    middleware(request({ authorization: 'Bearer wrong-token' }), denied, next); middleware(request({ authorization: 'Bearer correct-token' }), response(), next);
    expect(denied.statusCode).toBe(401); expect(denied.body).toEqual({ error: 'Authentication required' }); expect(denied.set).toHaveBeenCalledWith('WWW-Authenticate', expect.stringContaining('Basic')); expect(next).toHaveBeenCalledTimes(1);
  });
  it('accepts a browser basic-auth session without exposing a token to frontend code', () => {
    process.env.NODE_ENV = 'development'; const next = jest.fn();
    const header = `Basic ${Buffer.from('personal:configured').toString('base64')}`;
    createApiSecurity({ token: 'configured' })(request({ authorization: header }), response(), next);
    expect(next).toHaveBeenCalledTimes(1);
  });
  it('rejects basic-auth credentials for a different user', () => {
    process.env.NODE_ENV = 'development'; const denied = response();
    createApiSecurity({ token: 'configured' })(request({ authorization: 'Basic b3RoZXI6Y29uZmlndXJlZA==' }), denied, jest.fn());
    expect(denied.statusCode).toBe(401);
  });
  it('allows the health endpoint without authentication', () => { process.env.NODE_ENV = 'production'; const next = jest.fn(); createApiSecurity({ token: 'configured' })(request({ path: '/api/health' }), response(), next); expect(next).toHaveBeenCalledTimes(1); });
  it('throttles authenticated mutations by source IP', () => {
    process.env.NODE_ENV = 'development'; let time = 100000; const middleware = createApiSecurity({ token: 'configured', limit: 2, now: () => time }); const next = jest.fn();
    middleware(request({ method: 'POST', authorization: 'Bearer configured' }), response(), next); middleware(request({ method: 'POST', authorization: 'Bearer configured' }), response(), next);
    const limited = response(); middleware(request({ method: 'POST', authorization: 'Bearer configured' }), limited, next); expect(limited.statusCode).toBe(429);
    time += 60001; middleware(request({ method: 'POST', authorization: 'Bearer configured' }), response(), next); expect(next).toHaveBeenCalledTimes(3);
  });
  it('restricts browser origins to the configured allow-list', () => { const options = createCorsOptions({ origin: 'https://site.example, https://admin.example' }); const allowed = jest.fn(); const denied = jest.fn(); options.origin('https://admin.example', allowed); options.origin('https://other.example', denied); expect(allowed).toHaveBeenCalledWith(null, true); expect(denied.mock.calls[0][0]).toBeInstanceOf(Error); });
});
