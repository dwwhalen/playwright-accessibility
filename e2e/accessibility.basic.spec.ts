import { test, expect } from '@playwright/test';
import path from 'path';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';

test.describe('Accessibility University testing', () => {
  test('Full page scan should of BEFORE page', async ({ page }) => {
    await page.goto('https://www.washington.edu/accesscomputing/AU/before.html');
    await page.waitForLoadState('networkidle');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    createHtmlReport({
      results: accessibilityScanResults,
      options: {
          outputDir: path.join('e2e', 'test-results', 'accessibility-results'),
          reportFileName: `my-report.html`,
      },
  });
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});