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

/**
 * Test scenario: Change the subtitle of card by using overridden fields
 */
test('Override Subtitle', async ({ page, panelEditPage }) => {
  const expected_value = 'overridden subtitle';

  // Arrange
  await Arrange(page, panelEditPage);
  await SetPanelOption(page, 'CardTitle', 'test subtitle');
  //await SetPanelOption(page, "FlipPanel", false); // Doesn't work => skipped
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card

  // Act
  await SetPanelOption(page, 'OverrideSubtitle', expected_value);

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Subtitle', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Change the metric unit of card by using overridden fields
 */
test('Override metric unit', async ({ page, panelEditPage }) => {
  const expected_value = 'over';

  // Arrange
  await Arrange(page, panelEditPage);
  await SetPanelOption(page, 'Unit', 'test');
  await SetPanelOption(page, 'StayOn', 'Front');

  // Act
  await SetPanelOption(page, 'OverrideMetricUnit', expected_value);

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Unit', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Change the aggregation mode of card by using overridden fields
 */
test('Override aggregation', async ({ page, panelEditPage }) => {
  const queries_value = '1,2,3,4,5,6,5,4,3,2,1';
  const expected_value = '6';

  // Arrange
  await Arrange(page, panelEditPage, queries_value);
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card
  await SetPanelOption(page, 'Aggregation', 'min');

  // Act
  await SetPanelOption(page, 'OverrideAggregation', 'max');

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Metric', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Change threshold conf of card by using overridden fields
 */
test('Override threshold', async ({ page, panelEditPage }) => {
  const expected_values = ['rgb(125, 27, 224)', 'overridden', '5'];

  // Arrange
  await Arrange(page, panelEditPage, '1,2,3,4,5,6');
  await SetPanelOption(page, 'Thresholds', ['rgb(255, 0, 0)', 'testsev', '5']);
  await page.waitForTimeout(600);

  // Act
  await SetPanelOption(page, 'OverrideThreshold', expected_values);
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

/**
 * Test scenario: Change url of card by using overridden fields
 */
test('Override url', async ({ page, panelEditPage }) => {
  const expected_value = 'http://overridden.url';

  // Arrange
  await Arrange(page, panelEditPage);
  await SetPanelOption(page, 'Url', 'http://test.url');

  // Act
  await SetPanelOption(page, 'OverrideUrl', expected_value);

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Url', 0)) as Locator;
  expect(await locator.getAttribute('href')).toBe(expected_value);
});
