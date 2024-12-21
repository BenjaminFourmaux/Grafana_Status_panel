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

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Metric', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Test Aggregation Mode First
 */
test('First', async ({ page, panelEditPage }) => {
  const queries_value = '9,8,7,6,5,4,3,2,1';
  const expected_value = '9';

  // Arrange
  await Arrange(page, panelEditPage, queries_value);

  // Act
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card
  await SetPanelOption(page, 'Aggregation', 'First');

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Metric', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Test Aggregation Mode Max
 */
test('Max', async ({ page, panelEditPage }) => {
  const queries_value = '1,2,3,4,5,6,5,4,3,2,1';
  const expected_value = '6';

  // Arrange
  await Arrange(page, panelEditPage, queries_value);

  // Act
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card
  await SetPanelOption(page, 'Aggregation', 'Max');

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Metric', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Test Aggregation Mode Min
 */
test('Min', async ({ page, panelEditPage }) => {
  const queries_value = '2,8,9,1,4,3,7,8';
  const expected_value = '1';

  // Arrange
  await Arrange(page, panelEditPage, queries_value);

  // Act
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card
  await SetPanelOption(page, 'Aggregation', 'Min');

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Metric', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Test Aggregation Mode Min
 */
test('Sum', async ({ page, panelEditPage }) => {
  const queries_value = '2,8,9,1,4,3,7,8';
  const expected_value = '42';

  // Arrange
  await Arrange(page, panelEditPage, queries_value);

  // Act
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card
  await SetPanelOption(page, 'Aggregation', 'Sum');

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Metric', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Test Aggregation Mode Avg
 */
test('Avg', async ({ page, panelEditPage }) => {
  const queries_value = '2,8,9,1,4,3,7,8';
  const expected_value = '5.25';

  // Arrange
  await Arrange(page, panelEditPage, queries_value);

  // Act
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card
  await SetPanelOption(page, 'Aggregation', 'Avg');

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Metric', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Test Aggregation Mode Count
 */
test('Count', async ({ page, panelEditPage }) => {
  const queries_value = '2,8,9,1,4,3,7,8';
  const expected_value = '8';

  // Arrange
  await Arrange(page, panelEditPage, queries_value);

  // Act
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card
  await SetPanelOption(page, 'Aggregation', 'Count');

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Metric', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Test Aggregation Mode Min
 */
test('Delta', async ({ page, panelEditPage }) => {
  const queries_value = '2,8,9,1,4,3,7,8';
  const expected_value = '8';

  // Arrange
  await Arrange(page, panelEditPage, queries_value);

  // Act
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card
  await SetPanelOption(page, 'Aggregation', 'Delta');

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Metric', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});
