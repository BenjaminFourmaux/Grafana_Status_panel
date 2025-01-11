import { Locator, Page } from '@playwright/test';
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

/**
 * Permit to set Panel options like the card title, url, thresholds ...
 * @param page
 * @param kind Name of the input to set
 * @param value The value to set in the input
 */
export async function SetPanelOption(page: Page, kind: string, value: any) {
  switch (kind) {
    case 'CardTitle':
      await page
        .getByLabel('Status Panel - options Title field property editor')
        .getByTestId('input-wrapper')
        .locator('input')
        .fill(value);
      await page.keyboard.press('Enter');
      break;
    case 'CardSubtitle':
      await page
        .getByLabel('Status Panel - options Subtitle field property editor')
        .getByTestId('input-wrapper')
        .locator('input')
        .fill(value);
      await page.keyboard.press('Enter');
      break;
    case 'Url':
      await page
        .getByLabel('Status Panel - options URL field property editor')
        .getByTestId('input-wrapper')
        .locator('input')
        .fill(value);
      await page.keyboard.press('Enter');
      break;
    case 'OpenUrl':
      await page
        .getByLabel('Status Panel - options Open URL in new tab field property editor')
        .getByLabel('Toggle switch')
        .click({ force: true });
      break;
    case 'AggregateQueries':
      await page
        .getByLabel('Status Panel - options Aggregate queries in a single card field property editor')
        .getByLabel('Toggle switch')
        .click({ force: true });
      break;
    case 'FlipPanel':
      await page
        .getByLabel('Status Panel - options Flip Panel field property editor')
        .getByLabel('Toggle switch')
        .click({ force: true });
      break;
    case 'StayOn':
      if (value === 'Front') {
        await page
          .getByLabel('Status Panel - options Stay on field property editor')
          .getByRole('radio')
          .first()
          .click();
      } else {
        await page.getByLabel('Status Panel - options Stay on field property editor').getByRole('radio').last().click();
      }
      break;
    case 'Unit':
      await page
        .getByLabel('Status Panel - display options Metric Unit field property editor')
        .getByTestId('input-wrapper')
        .getByPlaceholder('Choose')
        .fill(value);
      // Cause .fill() not work with this input field (UnitPicker), need to browse all char and typing
      for (let i = 0; i < value.toString().length; i++) {
        await page.keyboard.press(value.toString()[i]);
      }
      await page.keyboard.press('Enter');
      break;
    case 'Aggregation':
      await page
        .getByLabel('Status Panel - display options Aggregation field property editor')
        .getByRole('combobox')
        .click();
      for (let i = 0; i < value.toString().length; i++) {
        await page.keyboard.press(value.toString()[i]);
      }
      await page.keyboard.press('Enter');
      break;
    case 'Thresholds':
      await page
        .getByLabel('Status Panel - thresholds Thresholds field property editor')
        .getByRole('button', { name: 'Add threshold' })
        .click();
      await page.waitForTimeout(200);
      const last_threshold = page
        .getByLabel('Status Panel - thresholds Thresholds field property editor')
        .getByTestId('thresholds-configuration-inputs')
        .nth(0);
      // Set severity
      await last_threshold.getByPlaceholder('Severity').fill(value[1]);
      // Set value
      await last_threshold.getByPlaceholder('value').fill(value[2]);
      // Set color
      await last_threshold.getByTestId('data-testid-colorswatch').click();
      await page.locator('#grafana-portal-container').getByRole('button', { name: 'Custom' }).click();
      await page.locator('#grafana-portal-container').getByTestId('input-wrapper').locator('input').click();
      await page.locator('#grafana-portal-container').getByTestId('input-wrapper').locator('input').fill(value[0]);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);
      // Click outside to close the color picker
      await page.getByTestId('data-testid panel content').click();

      break;
    case 'OverrideTitle':
      await setOverrideFields(page, 'Title', value);
      break;
    case 'OverrideSubtitle':
      await setOverrideFields(page, 'Subtitle', value);
      break;
    case 'OverrideMetricUnit':
      await setOverrideFields(page, 'Unit', value);
      break;
    case 'OverrideAggregation':
      await setOverrideFields(page, 'Aggregation', value);
      break;
    case 'OverrideThreshold':
      await setOverrideFields(page, 'Thresholds', value);
      break;
    case 'OverrideUrl':
      await setOverrideFields(page, 'Url', value);
      break;
  }
}

/**
 * Get Locator selected by the kind in Panel
 * @param page
 * @param kind What you want
 * @param index Index if you want to select a specific card. Empty for browse all card
 */
export async function GetPanelCardAttribute(
  page: Page,
  kind: string,
  index: number | undefined = undefined
): Promise<Locator | Locator[]> {
  const panel = page.getByTestId('data-testid panel content');
  const cards = panel.locator('div.react-card-flip');

  if (index !== undefined) {
    if (kind === 'Color') {
      return extractCardColor(panel, index);
    } else if (kind === 'Url' || kind === 'OpenUrl') {
      return extractrAhrefLocator(panel, index);
    }

    return extractAttribute(cards.nth(index), kind);
  } else {
    let locators: Locator[] = [];

    const elementsCount = await cards.count();

    for (let i = 0; i < elementsCount; i++) {
      if (kind === 'Color') {
        locators.push(await extractCardColor(panel, i));
      } else if (kind === 'Url' || kind === 'OpenUrl') {
        locators.push(await extractrAhrefLocator(panel, i));
      } else {
        let locator = extractAttribute(cards.nth(i), kind);
        locators.push(locator);
      }
    }

    return locators;
  }
}

/**
 * Add a new query with the scenario CSV Metric Values
 * @param page
 * @param panelEditPage
 * @param csv_data
 */
export async function AddQuery(page: Page, panelEditPage: PanelEditPage, csv_data: string | undefined = undefined) {
  // Add a new query
  await page.getByTestId('data-testid query-tab-add-query').click();

  await panelEditPage.refreshPanel();

  // Set the scenario
  await page.getByLabel('Scenario').last().fill('CSV Metric Values');
  await page.keyboard.press('Enter');
  // Set scenario's data
  if (csv_data) {
    await page.getByText('String Input').last().fill(csv_data); // By default: 1,20,90,30,5,0
    await page.keyboard.press('Enter');
  }
}

/**
 * Get the number of cards displayed in the panel
 * @param page
 */
export async function CountCards(page: Page): Promise<number> {
  const panel = page.getByTestId('data-testid panel content');
  const cards = panel.locator('div.react-card-flip');

  return await cards.count();
}

/**
 * Extract the Locator of the kind attribute you want
 * @param card
 * @param kind Name of the attribute you want. like Title, Subtitle ...
 */
function extractAttribute(card: Locator, kind: string) {
  switch (kind) {
    case 'Title':
      return card.locator('span#card-title');
    case 'Subtitle':
      return card.locator('span#card-subtitle');
    case 'Metric':
      return card.locator('span#card-metric');
    case 'Unit':
      return card.locator('span#card-unit');
    case 'Severity':
      return card.locator('span#card-severity');
    default:
      return card;
  }
}

async function extractrAhrefLocator(panel: Locator, index: number) {
  if (index === undefined) {
    index = 0;
  }
  let list_cards = panel.locator('a');

  return list_cards.nth(index);
}

async function extractCardColor(panel: Locator, index: number) {
  if (index === undefined) {
    index = 0;
  }
  let list_cards = await panel.locator('div > div > div > div');

  return list_cards.nth(index);
}

export function convertDateTime(dateString: string) {
  const regex = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;

  const match = dateString.match(regex);

  if (match) {
    const jour = parseInt(match[1], 10);
    const mois = parseInt(match[2], 10) - 1;
    const annee = parseInt(match[3], 10);
    const heure = parseInt(match[4], 10);
    const minutes = parseInt(match[5], 10);
    const secondes = parseInt(match[6], 10);

    return new Date(annee, mois, jour, heure, minutes, secondes);
  } else {
    return new Date();
  }
}

// @ts-ignore
async function findNodesWithColorDeeper(node: Locator, results: Locator[] = []) {
  const color = await node.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('background-color');
  });

  if (color !== '' && color !== 'null' && color !== 'rgba(0, 0, 0, 0)') {
    results.push(node); // find a node with a background color
  }

  const childElements = await node.all();
  for (const child of childElements) {
    await findNodesWithColorDeeper(child, results);
  }
  return results;
}

async function setOverrideFields(page: Page, kind: string, value: any) {
  // Add new override
  await page.getByTestId('data-testid Value picker button Add field override').click();
  await page.getByText('Fields with name', { exact: true }).click();

  // Set the field name
  await page.getByTestId('data-testid Options group Override 1').locator('input').fill('A-series');
  await page.keyboard.press('Enter');

  // Set the override value name
  switch (kind) {
    case 'Title':
      await page.getByTestId('data-testid Value picker button Add override property').click();
      for (let i = 0; i < 'status panel - options > title'.length; i++) {
        await page.keyboard.press('status panel - options > title'[i]);
      }
      await page.keyboard.press('Enter');

      // Set the override value
      await page
        .getByTestId('data-testid Options group Override 1')
        .getByTestId('input-wrapper')
        .locator('input')
        .fill(value);
      await page.keyboard.press('Enter');
      break;
    case 'Subtitle':
      await page.getByTestId('data-testid Value picker button Add override property').click();
      for (let i = 0; i < 'status panel - options > subtitle'.length; i++) {
        await page.keyboard.press('status panel - options > subtitle'[i]);
      }
      await page.keyboard.press('Enter');

      // Set the override value
      await page
        .getByTestId('data-testid Options group Override 1')
        .getByTestId('input-wrapper')
        .locator('input')
        .fill(value);
      await page.keyboard.press('Enter');
      break;
    case 'Url':
      await page.getByTestId('data-testid Value picker button Add override property').click();
      for (let i = 0; i < 'status panel - options > url'.length; i++) {
        await page.keyboard.press('status panel - options > url'[i]);
      }
      await page.keyboard.press('Enter');

      // Set the override value
      await page
        .getByTestId('data-testid Options group Override 1')
        .getByTestId('input-wrapper')
        .locator('input')
        .fill(value);
      await page.keyboard.press('Enter');
      break;
    case 'Unit':
      await page.getByTestId('data-testid Value picker button Add override property').click();
      for (let i = 0; i < 'status panel - display options > metric unit'.length; i++) {
        await page.keyboard.press('status panel - display options > metric unit'[i]);
      }
      await page.keyboard.press('Enter');

      // Set the override value
      await page
        .getByTestId('data-testid Options group Override 1')
        .getByTestId('input-wrapper')
        .locator('input')
        .click();
      for (let i = 0; i < value.length; i++) {
        await page.keyboard.press(value[i]);
      }
      await page.keyboard.press('Enter');
      break;
    case 'Aggregation':
      await page.getByTestId('data-testid Value picker button Add override property').click();
      for (let i = 0; i < 'status panel - display options > aggregation'.length; i++) {
        await page.keyboard.press('status panel - display options > aggregation'[i]);
      }
      await page.keyboard.press('Enter');

      // Set the override value
      await page.waitForTimeout(200);
      await page.getByTestId('data-testid Options group Override 1').getByRole('combobox').nth(1).click();
      for (let i = 0; i < value.length; i++) {
        await page.keyboard.press(value[i]);
      }
      await page.keyboard.press('Enter');
      break;
    case 'Thresholds':
      await page.getByTestId('data-testid Value picker button Add override property').click();
      for (let i = 0; i < 'status panel - thresholds > thresholds'.length; i++) {
        await page.keyboard.press('status panel - thresholds > thresholds'[i]);
      }
      await page.keyboard.press('Enter');

      // Deploy dropdown
      await page
        .getByTestId('data-testid Options group Override 1')
        .getByTestId('data-testid Options group Thresholds toggle')
        .click();
      await page
        .getByTestId('data-testid Options group Override 1')
        .getByTestId('data-testid Options group Thresholds toggle')
        .click(); // reclick (bug)

      // Add a new threshold
      await page
        .getByTestId('data-testid Options group Override 1')
        .getByRole('button', { name: 'Add threshold' })
        .click();
      await page.waitForTimeout(200);
      const last_threshold = page
        .getByTestId('data-testid Options group Override 1')
        .getByTestId('thresholds-configuration-inputs')
        .nth(0);
      // Set severity
      await last_threshold.getByPlaceholder('Severity').fill(value[1]);
      // Set value
      await last_threshold.getByPlaceholder('value').fill(value[2]);
      // Set color
      await last_threshold.getByTestId('data-testid-colorswatch').click();
      await page.locator('#grafana-portal-container').getByRole('button', { name: 'Custom' }).click();
      await page.locator('#grafana-portal-container').getByTestId('input-wrapper').locator('input').click();
      await page.locator('#grafana-portal-container').getByTestId('input-wrapper').locator('input').fill(value[0]);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);
      // Click outside to close the color picker
      await page.getByTestId('data-testid panel content').click();
      break;
  }
}
