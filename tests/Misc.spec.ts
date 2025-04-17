import { expect, test } from '@grafana/plugin-e2e';
// @ts-ignore
import { Arrange, GetPanelCardAttribute, SetPanelOption } from './utils';

/**
 * Test scenario: Display 'no data' when query returns no data
 */
test('Display no data', async ({ page, panelEditPage }) => {
  const expected_value = 'no data';

  // Arrange
  await Arrange(page, panelEditPage, 'no data point');

  // Act

  // Assert
  const panelText = page.getByTestId('data-testid panel content').locator('div');
  expect(await panelText.textContent()).toBe(expected_value);
});

/**
 * Test scenario: Display nothing when query returns no data and options IsNothingOnNoData is true
 */
test('Display nothing on no data', async ({ page, panelEditPage }) => {
  // Arrange
  await Arrange(page, panelEditPage, 'no data point');

  // Act
  await SetPanelOption(page, 'DisplayNoData', true); // Display side card

  // Assert
  const panelText = page.getByTestId('data-testid panel content').locator('div');
  expect(await panelText.count()).toBe(0);
});
