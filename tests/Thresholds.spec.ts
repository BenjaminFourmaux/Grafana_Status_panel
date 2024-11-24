import { expect, test } from '@grafana/plugin-e2e';
// @ts-ignore
import { Arrange } from './utils';

/**
 * Test scenario: Check if the Status Panel as visualisation is correctly set
 */
test('Init set Status Panel as visualisation', async ({ page, panelEditPage }) => {
  // Arrange
  await Arrange(page, panelEditPage);

  // Act
  await expect(panelEditPage.refreshPanel()).toBeOK();

  // Assert
  await expect(panelEditPage.panel.locator.getByText('Base')).toBeVisible();
});
