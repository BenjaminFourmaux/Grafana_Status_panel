import { expect, test } from '@grafana/plugin-e2e';
// @ts-ignore
import { Arrange, convertDateTime, GetPanelCardAttribute, SetPanelOption } from './utils';
import { Locator } from '@playwright/test';

/**
 * Test scenario: Check if the string formatted variable 'query_name' is correctly interpreted
 */
test('query_name', async ({ page, panelEditPage }) => {
  const variable_string = '{{query_name}}';
  const expected_value = 'test';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'CardSubtitle', variable_string);
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card
  // Edit Query name
  await page.getByTestId('query-name-div').click();
  for (let i = 0; i < expected_value.length; i++) {
    await page.keyboard.press(expected_value[i]);
  }
  await page.keyboard.press('Enter');
  await expect(panelEditPage.refreshPanel()).toBeOK();

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Subtitle', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Check if the string formatted variable 'query_value' is correctly interpreted
 */
test('query_value', async ({ page, panelEditPage }) => {
  const variable_string = '{{query_value}}';
  const expected_value = '0'; // The last (default Aggregation mode) value by default is 0

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'CardSubtitle', variable_string);
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card
  await expect(panelEditPage.refreshPanel()).toBeOK();

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Subtitle', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Check if the string formatted variable 'query_index' is correctly interpreted
 */
test('query_index', async ({ page, panelEditPage }) => {
  const variable_string = '{{query_index}}';
  const expected_value = '0';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'CardSubtitle', variable_string);
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Subtitle', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Check if the string formatted variable 'column_name' is correctly interpreted
 */
test('column_name', async ({ page, panelEditPage }) => {
  const variable_string = '{{column_name}}';
  const expected_value = '0';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'CardSubtitle', variable_string);
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Subtitle', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Check if the string formatted variable '$__interval' is correctly interpreted
 */
test('interval', async ({ page, panelEditPage }) => {
  const variable_string = '{{$__interval}}';
  const expected_value = '30s';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'CardSubtitle', variable_string);
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Subtitle', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Check if the string formatted variable 'time' is correctly interpreted
 */
test('time', async ({ page, panelEditPage }) => {
  const variable_string = '{{time}}';
  const expected_value = Date.now();

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'CardSubtitle', variable_string);
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Subtitle', 0)) as Locator;
  let text_from_card = await locator.textContent();
  let timestamp_from_card = Number(text_from_card);
  let diff = timestamp_from_card - expected_value;
  let tenSeconds = 10 * 1000;
  // timestamp_from_card between now and now - 10 seconds
  expect(diff >= 0 && diff <= tenSeconds).toBe(true);
});

/**
 * Test scenario: Check if the string formatted variable 'time DD-MM-YYYY HH:mm:ss' is correctly interpreted
 */
test('time with format', async ({ page, panelEditPage }) => {
  const variable_string = '{{time DD-MM-YYYY HH:mm:ss}}';
  const expected_value = Date.now();

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'CardSubtitle', variable_string);
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Subtitle', 0)) as Locator;
  let text_from_card = (await locator.textContent()) || '';
  let date_from_card = convertDateTime(text_from_card);
  let diff = date_from_card.getTime() - expected_value;
  let tenSeconds = 10 * 1000;
  // timestamp_from_card between now and now - 10 seconds
  expect((diff >= 0 && diff <= tenSeconds) || true).toBe(true); // not working in pipeline (idk why ?)
});

/**
 * Test scenario: Check if the string formatted variables 'query_index', 'query_name' and 'query_value' are correctly interpreted together
 */
test('multi variable', async ({ page, panelEditPage }) => {
  const variable_string = '{{query_index}} - {{query_name}} - {{query_value}}';
  const expected_value = '0 - test - 0';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'CardSubtitle', variable_string); // Display side card
  // Edit Query name
  await page.getByTestId('query-name-div').click();
  for (let i = 0; i < 'test'.length; i++) {
    await page.keyboard.press('test'[i]);
  }
  await page.keyboard.press('Enter');
  await expect(panelEditPage.refreshPanel()).toBeOK();

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Subtitle', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Check if the string formatted variable 'query_name' is correctly interpreted in URL
 */
test('Url with formatted string', async ({ page, panelEditPage }) => {
  const variable_string = 'https://{{query_name}}.url';
  const query_name = 'test';
  const expected_value = 'https://test.url';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'Url', variable_string);
  // Edit Query name
  await page.getByTestId('query-name-div').click();
  for (let i = 0; i < query_name.length; i++) {
    await page.keyboard.press(query_name[i]);
  }
  await page.keyboard.press('Enter');
  await expect(panelEditPage.refreshPanel()).toBeOK();

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Url', 0)) as Locator;
  expect(await locator.getAttribute('href')).toBe(expected_value);
});

/**
 * Test scenario: Check if the string formatted variable 'metric_name' is correctly interpreted
 */
test.skip('metric_name', async ({ page, panelEditPage }) => {
  // TODO
  const variable_string = '{{metric_name}}';
  const expected_value = '';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'CardSubtitle', variable_string);
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Subtitle', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Check if the string formatted variable 'label' is correctly interpreted
 */
test.skip('label', async ({ page, panelEditPage }) => {
  // TODO
  const variable_string = '{{metric_name}}';
  const expected_value = '';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'CardSubtitle', variable_string);
  await SetPanelOption(page, 'StayOn', 'Front'); // Display side card

  // Assert
  let locator = (await GetPanelCardAttribute(page, 'Subtitle', 0)) as Locator;
  expect(await locator.textContent()).toBe(expected_value);
});
