import { expect, test } from '@playwright/test';

test('authenticated personal site serves its shell and health endpoint', async ({ page, request }) => {
  const pageResponse = await page.goto('/');

  expect(pageResponse?.status()).toBe(200);
  await expect(page.locator('#root')).toBeVisible();

  const healthResponse = await request.get('/api/health');

  expect(healthResponse.status()).toBe(200);
  await expect(healthResponse.json()).resolves.toMatchObject({
    status: 'ok',
  });
});
