import { Page, test } from '@playwright/test';
import path from 'path';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';

const { expect } = require('@playwright/test');

type AccessibilityScanResults = {
    violations: Array<{
        id: string;
        description: string;
        impact?: string | null | undefined;
        nodes: Array<any>;
    }>;
};

/**
 * Analyze the accessibility of the page
 * @param {Page} page - Playwright page instance
 * @param {string} pageName - Used as the report name
 * @param {boolean} [failWhenViolationsFound=false] - If true, the test will fail if there are any accessibility violations
 * @returns {Promise<AccessibilityScanResults>} - Accessibility scan results
 */
export default async function analyzeAccessibility(
    page: Page,
    pageName: string,
    failWhenViolationsFound: boolean = false
): Promise<AccessibilityScanResults> {
    await page.waitForLoadState();
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
        // .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        // .withTags(['best-practice'])
        // .exclude('#element-with-known-issue')
        // .withRules(['color-contrast'])
        .analyze();

    const playwrightProjectName = test.info().project.name;
    const fullReportName = `accessibility-${playwrightProjectName}-${pageName}`;

    const accessibilityReportOutputDir = process.cwd().includes('e2e')
        ? path.join('test-results', 'accessibility-results')
        : path.join('e2e', 'test-results', 'accessibility-results');

    createHtmlReport({
        results: accessibilityScanResults,
        options: {
            outputDir: accessibilityReportOutputDir,
            reportFileName: `${fullReportName}.html`,
        },
    });
    // Calculate the total number of occurrences for all violations
    const totalOccurrences = accessibilityScanResults.violations.reduce((acc, violation) => acc + violation.nodes.length, 0);
    if (failWhenViolationsFound) {
        expect(totalOccurrences).toBe(0);
    } else {
        if (totalOccurrences !== 0) {
            console.log(
                `***WARNING*** ${totalOccurrences} accessibility violations found for page: ${pageName}`
            );
        }
    }
    return accessibilityScanResults;
}
