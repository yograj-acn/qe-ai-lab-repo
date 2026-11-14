// REFERENCE EXAMPLE ONLY — this does not run against Breezewood Hotels.
//
// It exists purely to show the conventions a generated Playwright spec
// should follow in this project, so they can be captured in a Cursor Skill:
//   1. Test data lives in a companion JSON file, never hardcoded inline.
//   2. Elements are located by their stable `data-testid` attribute, not
//      visible text or labels that can change between app modes.
//   3. Each assertion maps to one field of the source test case's
//      "Expected Result", so a reviewer can trace spec <-> test case.
import { test, expect } from '@playwright/test';
import sampleData from './sample.data.json';

test('REFERENCE - sample example: search a fictitious catalog page', async ({ page }) => {
  await page.goto(sampleData.path);

  await page.getByTestId('keyword-input').fill(sampleData.data.keyword);
  await page.getByTestId('category-select').selectOption(sampleData.data.category);
  await page.getByTestId('search-submit').click();

  const results = page.getByTestId('results-list');
  await expect(results).toBeVisible();
  await expect(results.getByTestId('result-item').first()).toContainText(
    sampleData.expected.firstResultContains
  );
});
