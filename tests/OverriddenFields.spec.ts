import { expect, test } from '@grafana/plugin-e2e';
// @ts-ignore
import { Arrange, GetPanelCardAttribute, SetPanelOption } from './utils';
import { Locator } from '@playwright/test';

/**
 * Test scenario: Change the title of card by using overridden fields
 */
test('Override Title', async ({ page, panelEditPage }) => {
  const expected_value = 'overridden title';

  // Arrange
  await Arrange(page, panelEditPage);
  await SetPanelOption(page, 'CardTitle', 'test title');
  //await SetPanelOption(page, "FlipPanel", false); // Doesn't work => skipped
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card

  // Act
  await SetPanelOption(page, 'OverrideTitle', expected_value);

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Title', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});
