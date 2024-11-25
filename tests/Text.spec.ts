import { expect, test } from '@grafana/plugin-e2e';
// @ts-ignore
import { Arrange, GetPanelCardAttribute, SetPanelOption } from './utils';
import { Locator } from '@playwright/test';

/**
 * Test scenario: Check if the card title correspond with the title wrote on the card
 */
test('Same card title', async ({ page, panelEditPage }) => {
  const expected_value = 'test title';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'CardTitle', expected_value);
  //await SetPanelOption(page, "FlipPanel", false); // Doesn't work => skipped
  await SetPanelOption(page, 'StayOn', 'Front'); // Display

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Title', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Check if the card subtitle correspond with the subtitle wrote on the card
 */
test('Same card subtitle', async ({ page, panelEditPage }) => {
  const expected_value = 'test subtitle';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'CardSubtitle', expected_value);
  //await SetPanelOption(page, "FlipPanel", false); // Doesn't work => skipped
  await SetPanelOption(page, 'StayOn', 'Front'); // Display

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Subtitle', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});
