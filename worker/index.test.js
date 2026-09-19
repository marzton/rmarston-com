'use strict';

const worker = require('./index').default;

describe('Cloudflare Worker API-only routing', () => {
  test('redirects the apex to the AI Studio portfolio app', async () => {
    const response = await worker.fetch(new Request('https://rmarston.com/'), {});

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('https://rob-marston-portfolio.ai.studio/');
  });

  test('redirects www to the AI Studio portfolio app, preserving path', async () => {
    const response = await worker.fetch(new Request('https://www.rmarston.com/work?ref=x'), {});

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('https://rob-marston-portfolio.ai.studio/work?ref=x');
  });

  test('returns 410 for an unknown route on a non-apex hostname', async () => {
    const response = await worker.fetch(new Request('https://api.rmarston.com/missing'), {});

    expect(response.status).toBe(410);
    expect(await response.text()).toContain('No worker route is configured');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
});
