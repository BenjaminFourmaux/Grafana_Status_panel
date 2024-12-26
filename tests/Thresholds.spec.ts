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

/**
 * Test scenario: Two Thresholds configuration but only number 1 must be used
 */
test('Two threshold, first must be used', async ({ page, panelEditPage }) => {
  const expected_values = [
    ['rgb(125, 27, 224)', 'testsev1', '5'],
    ['rgb(255, 0, 0)', 'testsev2', '10'],
  ];

  // Arrange
  await Arrange(page, panelEditPage, '1,2,3,4,5,6');

  // Act
  await SetPanelOption(page, 'Thresholds', expected_values[0]);
  await page.waitForTimeout(600);
  await SetPanelOption(page, 'Thresholds', expected_values[1]);
  await page.waitForTimeout(600);

  // Assert
  const card_severity = (await GetPanelCardAttribute(page, 'Severity', 0)) as Locator;
  const card_color = (await GetPanelCardAttribute(page, 'Color', 0)) as Locator;

  expect(await card_severity.textContent()).toBe(expected_values[0][1]);
  expect(
    await card_color.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('background-color');
    })
  ).toBe(expected_values[0][0]);
});

/**
 * Test scenario: Two Thresholds configuration but only number 2 must be used
 */
test('Two threshold, second must be used', async ({ page, panelEditPage }) => {
  const expected_values = [
    ['rgb(125, 27, 224)', 'testsev1', '5'],
    ['rgb(255, 0, 0)', 'testsev2', '10'],
  ];

  // Arrange
  await Arrange(page, panelEditPage, '1,2,3,4,5,13');

  // Act
  await SetPanelOption(page, 'Thresholds', expected_values[0]);
  await page.waitForTimeout(600);
  await SetPanelOption(page, 'Thresholds', expected_values[1]);
  await page.waitForTimeout(600);

  // Assert
  const card_severity = (await GetPanelCardAttribute(page, 'Severity', 0)) as Locator;
  const card_color = (await GetPanelCardAttribute(page, 'Color', 0)) as Locator;

  expect(await card_severity.textContent()).toBe(expected_values[1][1]);
  expect(
    await card_color.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('background-color');
    })
  ).toBe(expected_values[1][0]);
});

/**
 * Test scenario: One threshold configuration but Base must be used
 */
test('Using Base', async ({ page, panelEditPage }) => {
  const expected_values = ['rgb(115, 191, 105)', 'Base'];
  const threshold = ['rgb(125, 27, 224)', 'testsev', '5'];

  // Arrange
  await Arrange(page, panelEditPage, '1,2,3,4,5,4');

  // Act
  await SetPanelOption(page, 'Thresholds', threshold);

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
