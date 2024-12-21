import { expect, test } from '@grafana/plugin-e2e';
// @ts-ignore
import { Arrange, GetPanelCardAttribute, SetPanelOption } from './utils';
import { Locator } from '@playwright/test';

/**
 * Test scenario: Check one threshold configuration
 */
test('One threshold configuration', async ({ page, panelEditPage }) => {
  const expected_values = ['rgb(125, 27, 224)', 'testsev', '5'];

  // Arrange
  await Arrange(page, panelEditPage, '1,2,3,4,5,6');

  // Act
  await SetPanelOption(page, 'Thresholds', expected_values);

  await page.waitForTimeout(600);

  // Assert
  const card_severity = (await GetPanelCardAttribute(page, 'Severity', 0)) as Locator;
  const card_color = (await GetPanelCardAttribute(page, 'Color', 0)) as Locator;

  expect(await card_severity.textContent()).toBe(expected_values[1]);
  expect(
    await card_color.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('background-color');
    })
  ).toBe(expected_values[0]);
});
