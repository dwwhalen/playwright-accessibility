import { test } from '@playwright/test';
import analyzeAccessibility from './common/accessibility';

test.describe('Accessibility Testing - AU Demo Site', () => {
  test('Check accessibility issues for the BEFORE page', async ({ page }) => {
    await page.goto('https://www.washington.edu/accesscomputing/AU/before.html');
    await analyzeAccessibility(page, 'AU Demo Before Site', true);
  });
  test('Check accessibility issues for the AFTER page', async ({ page }) => {
    await page.goto('https://www.washington.edu/accesscomputing/AU/after.html');
    await analyzeAccessibility(page, 'AU Demo Before Site', true);
  });
});
