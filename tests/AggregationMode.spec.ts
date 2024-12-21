import { expect, test } from '@grafana/plugin-e2e';
// @ts-ignore
import { Arrange, convertDateTime, GetPanelCardAttribute, SetPanelOption } from './utils';
import { Locator } from '@playwright/test';

/**
 * Test scenario: Test Aggregation Mode Last
 */
test('Last', async ({ page, panelEditPage }) => {
  const queries_value = '1,2,3,4,5,6,5,4,3,2,1';
  const expected_value = '1';

  // Arrange
  await Arrange(page, panelEditPage, queries_value);

  // Act
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card
  await SetPanelOption(page, 'Aggregation', 'Last');
  await page.waitForTimeout(3000);

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Metric', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});
