import { expect, test } from '@grafana/plugin-e2e';
// @ts-ignore
import { AddQuery, Arrange, convertDateTime, CountCards, GetPanelCardAttribute, SetPanelOption } from './utils';
import { Locator } from '@playwright/test';

/**
 * Test scenario: Check if the wright number of cards is displayed
 */
test('Same number of cards', async ({ page, panelEditPage }) => {
  const expected_value = 2;

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await AddQuery(page, panelEditPage);

  // Assert
  expect(await CountCards(page)).toBe(expected_value);
});

/**
 * Test scenario: Check if the same title text in cards
 */
test('Same title on cards', async ({ page, panelEditPage }) => {
  const expected_value = 'Test Title';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await AddQuery(page, panelEditPage); // 2 queries
  await SetPanelOption(page, 'CardTitle', expected_value);
  //await SetPanelOption(page, "FlipPanel", false); // Doesn't work => skipped
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card

  // Assert
  let locator_card_1 = (await GetPanelCardAttribute(page, 'Title', 0)) as Locator;
  expect(await locator_card_1.textContent()).toBe(expected_value);
  let locator_card_2 = (await GetPanelCardAttribute(page, 'Title', 1)) as Locator;
  expect(await locator_card_2.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Check if the same subtitle text in cards
 */
test('Same subtitle on cards', async ({ page, panelEditPage }) => {
  const expected_value = 'Test Subtitle';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await AddQuery(page, panelEditPage); // 2 queries
  await SetPanelOption(page, 'CardSubtitle', expected_value);
  //await SetPanelOption(page, "FlipPanel", false); // Doesn't work => skipped
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card

  // Assert
  let locator_card_1 = (await GetPanelCardAttribute(page, 'Subtitle', 0)) as Locator;
  expect(await locator_card_1.textContent()).toBe(expected_value);
  let locator_card_2 = (await GetPanelCardAttribute(page, 'Subtitle', 1)) as Locator;
  expect(await locator_card_2.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Check if the same metric unit text in cards
 */
test('Same metric unit on cards', async ({ page, panelEditPage }) => {
  const expected_value = 'tests';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await AddQuery(page, panelEditPage); // 2 queries
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card
  await SetPanelOption(page, 'Unit', expected_value);

  // Assert
  let locator_card_1 = (await GetPanelCardAttribute(page, 'Unit', 0)) as Locator;
  expect(await locator_card_1.textContent()).toBe(expected_value);
  let locator_card_2 = (await GetPanelCardAttribute(page, 'Unit', 1)) as Locator;
  expect(await locator_card_2.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Check Aggregate queries
 */
test('Aggregate queries', async ({ page, panelEditPage }) => {
  const expected_value = 1;

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await AddQuery(page, panelEditPage); // 2 queries
  await SetPanelOption(page, 'AggregateQueries', true);

  // Assert
  expect(await CountCards(page)).toBe(expected_value);
});

/**
 * Test scenario: Check if the wright number of cards is displayed if one query return a multiple fields (a dataframe) (like Zabbix)
 */
test('Multiple fields', async ({ page, panelEditPage }) => {
  const expected_value = 3;

  // Arrange
  await Arrange(page, panelEditPage, 'random walk table');

  // Act

  // Assert
  expect(await CountCards(page)).toBe(expected_value);
});

/**
 * Test scenario: Check if only one card is displayed if one query return a multiple fields (a dataframe) (like Zabbix) when aggregate queries is enabled
 */
test('Multiple fields aggregate queries', async ({ page, panelEditPage }) => {
  const expected_value = 1;

  // Arrange
  await Arrange(page, panelEditPage, 'random walk table');

  // Act
  await SetPanelOption(page, 'AggregateQueries', true);

  // Assert
  expect(await CountCards(page)).toBe(expected_value);
});
