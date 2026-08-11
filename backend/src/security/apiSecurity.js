import { timingSafeEqual } from 'crypto';

const attemptsByIp = new Map();

function tokenMatches(actual, expected) {
  const supplied = Buffer.from(actual || '');
  const configured = Buffer.from(expected || '');
  return supplied.length === configured.length && timingSafeEqual(supplied, configured);
}

export function createCorsOptions({ origin = process.env.CORS_ORIGIN } = {}) {
  const allowedOrigins = (origin || '').split(',').map((value) => value.trim()).filter(Boolean);
  return {
    origin(requestOrigin, callback) {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) return callback(null, true);
      return callback(new Error('Origin is not allowed'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    maxAge: 600,
  };
}

export function createApiSecurity({ token = process.env.SITE_AUTH_TOKEN, limit = Number(process.env.MUTATION_RATE_LIMIT || 60), now = () => Date.now() } = {}) {
  if (process.env.NODE_ENV === 'production' && !token) throw new Error('SITE_AUTH_TOKEN must be configured in production');
  return (req, res, next) => {
    if (req.path === '/api/health' || process.env.NODE_ENV === 'test') return next();
    const supplied = req.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token || !tokenMatches(supplied, token)) return res.status(401).json({ error: 'Authentication required' });
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const cutoff = now() - 60_000;
      const attempts = (attemptsByIp.get(req.ip) || []).filter((timestamp) => timestamp > cutoff);
      if (attempts.length >= limit) return res.status(429).json({ error: 'Rate limit exceeded' });
      attempts.push(now());
      attemptsByIp.set(req.ip, attempts);
    }
    return next();
  };
}

export function resetApiSecurityState() { attemptsByIp.clear(); }
