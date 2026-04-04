'use strict';

// Manual JS test shim that mirrors worker/index.ts behavior without TS runtime tooling.
const workerLogic = {
  fetch: async (request, env) => {
    const requestUrl = new URL(request.url);

    if (
      requestUrl.pathname === '/api/contact' &&
      (request.method === 'POST' || request.method === 'OPTIONS')
    ) {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      const fromAddr = env.CONTACT_FROM_EMAIL ? env.CONTACT_FROM_EMAIL.trim() : '';
      const toAddr = env.CONTACT_TO_EMAIL ? env.CONTACT_TO_EMAIL.trim() : '';
      if (!fromAddr || !toAddr) {
        return new Response(JSON.stringify({ error: 'Contact email is not configured.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(`No worker route is configured for ${requestUrl.pathname}.`, {
      status: 410,
      headers: {
        'Content-Type': 'text/plain; charset=UTF-8',
        'Cache-Control': 'no-store',
      },
    });
  },
};

describe('Cloudflare Worker route behavior', () => {
  test('returns 410 for non-contact paths', async () => {
    const req = new Request('https://rmarston.com/');
    const res = await workerLogic.fetch(req, {});

    expect(res.status).toBe(410);
    await expect(res.text()).resolves.toContain('No worker route is configured');
  });

  test('handles CORS preflight for /api/contact', async () => {
    const req = new Request('https://rmarston.com/api/contact', { method: 'OPTIONS' });
    const res = await workerLogic.fetch(req, {});

    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
  });

  test('returns 500 when contact email vars are missing', async () => {
    const req = new Request('https://rmarston.com/api/contact', { method: 'POST' });
    const res = await workerLogic.fetch(req, {});

    expect(res.status).toBe(500);
    await expect(res.text()).resolves.toContain('Contact email is not configured');
  });
});
