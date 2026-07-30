import { test, expect } from '@playwright/test';

test('счётчик должен увеличиваться и уменьшаться', async ({ page }) => {
  await page.goto('/');
});
