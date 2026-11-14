import { test, expect } from '@playwright/test';
import caseData from './test-data/TC-001.json';

test('[TC-001][Search] Search for Bengaluru hotels returns seeded property', async ({ page }) => {
  await page.goto(caseData.path);

  await page.getByTestId('destination-input').fill(caseData.data.destination);
  await page.getByTestId('check-in-input').fill(caseData.data.checkIn);
  await page.getByTestId('check-out-input').fill(caseData.data.checkOut);
  await page.getByTestId('rooms-input').fill(caseData.data.rooms);
  await page.getByTestId('adults-input').fill(caseData.data.adults);
  await page.getByTestId('search-submit').click();

  await expect(page.getByTestId('property-name')).toContainText(caseData.expected.propertyName);
  await expect(page.getByTestId('nightly-rate')).toBeVisible();
});
