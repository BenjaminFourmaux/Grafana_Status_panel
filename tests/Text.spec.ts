import { expect, test } from '@grafana/plugin-e2e';
// @ts-ignore
import { Arrange, GetPanelCardAttribute, SetPanelOption } from './utils';

/**
 * Test scenario: Check if the card title correspond with the title wrote on the card
 */
test('Correct card title', async ({ page, panelEditPage }) => {
  const expected_value = 'test title';

  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await SetPanelOption(page, 'CardTitle', expected_value);
  //await SetPanelOption(page, "FlipPanel", false); // Doesn't work => skipped
  await SetPanelOption(page, 'StayOn', 'Front'); // Display

  // Assert
  let locator = await GetPanelCardAttribute(page, 'Title', 1);
  await expect(locator).toHaveText(expected_value);
  //await expect(panelEditPage.panel.locator.getByText('Base')).toBeVisible();
});
