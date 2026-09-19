'use strict';

const worker = require('./index').default;

describe('Cloudflare Worker API-only routing', () => {
  test('returns 410 for the apex (DNS points rmarston.com directly at AI Studio, not this Worker)', async () => {
    const response = await worker.fetch(new Request('https://rmarston.com/'), {});

    expect(response.status).toBe(410);
    expect(await response.text()).toContain('No worker route is configured');
  });

  test('returns 410 for an unknown API route', async () => {
    const response = await worker.fetch(new Request('https://api.rmarston.com/missing'), {});

    expect(response.status).toBe(410);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
});
