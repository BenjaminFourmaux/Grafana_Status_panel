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
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card

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
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Subtitle', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Check if the metric correspond with the query LAST value
 */
test('Same metric value', async ({ page, panelEditPage }) => {
  const query_values = [1, 2, 3, 4, 5, 6];

  // Arrange
  await Arrange(page, panelEditPage, query_values.toString());

  // Act
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Metric', 0)) as Locator;
  // Assert on the last query value case, by default Aggregation is set to Last
  expect(await locator.textContent()).toBe(query_values[query_values.length - 1].toString());
});

/**
 * Test scenario: Check if the metric unit correspond with the unit wrote on the card
 */
test('Same metric unit', async ({ page, panelEditPage }) => {
  const expected_value = 'tests';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'Unit', expected_value); // Display side card

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Unit', 0)) as Locator;
  // Assert on the last query value case, by default Aggregation is set to Last
  expect(await locator.textContent()).toBe(expected_value);
});
