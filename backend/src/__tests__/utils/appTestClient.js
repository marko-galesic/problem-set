import { IncomingMessage, ServerResponse } from 'http';
import { Duplex } from 'stream';

function createMockReqRes({ method, url, headers, body }) {
  const bodyChunks = [];
  const socket = new Duplex({
    read() {},
    write(_chunk, _encoding, callback) {
      callback();
    }
  });

  const req = new IncomingMessage(socket);
  req.method = method;
  req.url = url;
  req.headers = Object.fromEntries(
    Object.entries(headers || {}).map(([key, value]) => [key.toLowerCase(), value])
  );

  let payload = null;
  if (body !== undefined) {
    payload = Buffer.from(JSON.stringify(body));
    if (!req.headers['content-type']) {
      req.headers['content-type'] = 'application/json';
    }
    req.headers['content-length'] = String(payload.length);
    req.body = body;
    req._body = true;
  }

  process.nextTick(() => {
    if (payload) {
      req.push(payload);
    }
    req.push(null);
  });

  const res = new ServerResponse(req);
  res.assignSocket(socket);

  const originalWrite = res.write.bind(res);
  res.write = (chunk, encoding, callback) => {
    if (chunk) {
      bodyChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
    }
    return originalWrite(chunk, encoding, callback);
  };

  const originalEnd = res.end.bind(res);
  res.end = (chunk, encoding, callback) => {
    if (chunk) {
      bodyChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
    }
    return originalEnd(chunk, encoding, callback);
  };

  return {
    req,
    res,
    getBody: () => Buffer.concat(bodyChunks).toString('utf8')
  };
}

export function createAppTestClient(app) {
  async function request(method, url, body) {
    const { req, res, getBody } = createMockReqRes({ method, url, body });
    app.handle(req, res);

    await new Promise((resolve) => {
      res.on('finish', resolve);
      res.on('close', resolve);
    });

    const bodyText = getBody();
    const contentType = res.getHeader('content-type') || '';
    let parsed = bodyText;
    if (bodyText && (contentType.includes('application/json') || bodyText.trim().startsWith('{') || bodyText.trim().startsWith('['))) {
      try {
        parsed = JSON.parse(bodyText);
      } catch {
        parsed = bodyText;
      }
    }

    return {
      status: res.statusCode,
      headers: res.getHeaders(),
      text: bodyText,
      body: parsed
    };
  }

  return {
    get: (url) => request('GET', url),
    post: (url, body) => request('POST', url, body),
    delete: (url) => request('DELETE', url),
    put: (url, body) => request('PUT', url, body)
  };
}
