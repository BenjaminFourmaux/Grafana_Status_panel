import { Page } from '@playwright/test';
import { PanelEditPage } from '@grafana/plugin-e2e';

/**
 * Arrange test scenario by creating new dashboard, panel and setting the datasource, scenario and visualization
 * @param page
 * @param panelEditPage
 * @param csv_data CSV data to be used in the datasource. By default: 1,20,90,30,5,0
 */
export async function Arrange(page: Page, panelEditPage: PanelEditPage, csv_data: string | undefined = undefined) {
  // Set datasource
  await panelEditPage.datasource.set('Static');
  // Set the scenario
  await page.getByLabel('Scenario').last().fill('CSV Metric Values');
  await page.keyboard.press('Enter');
  // Set scenario's data
  if (csv_data) {
    await page.getByText('String Input').last().fill(csv_data); // By default: 1,20,90,30,5,0
    await page.keyboard.press('Enter');
  }
  // Set Status Panel plugin as visualization
  await panelEditPage.setVisualization('Status Panel');
}
