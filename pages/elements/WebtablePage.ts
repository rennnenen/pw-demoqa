import { BasePage } from '@pages/BasePage';
import { expect, Locator, Page } from '@playwright/test';
import { and, given, then, when } from '@utils/Decorators';
import { WebtableRecord } from '@utils/interfaces/WebtableRecordInterface';
import { GenerateWebtableData } from '@fixtures/testdata/GenerateWebtableData';
import { RegistrationFormModal } from './RegistrationFormModal';

// Page object model for the Webtable page extending the BasePage
export class WebtablePage extends BasePage {
  // Define locators
  private readonly textPageHeader: Locator;
  private readonly buttonAddRecord: Locator;
  private readonly inputSearchRecord: Locator;
  private readonly buttonSearchRecord: Locator; //not needed but added for completeness
  private readonly tableRows: Locator;
  private readonly tableCells: Locator;
  private readonly buttonEditRecord: Locator;
  private readonly buttonDeleteRecord: Locator;
  private readonly buttonPreviousPage: Locator;
  private readonly buttonNextPage: Locator;
  private readonly inputJumpToPage: Locator;
  private readonly selectPagination: Locator;

  // Store webtable records for testing with email as the key
  data: { [key: string]: WebtableRecord } = {};

  // Initialize page and locators
  constructor(page: Page) {
    super(page);
    this.textPageHeader = page.getByRole('heading', { name: 'Web Tables' });
    this.buttonAddRecord = page.getByRole('button', { name: 'Add' });
    this.inputSearchRecord = page.getByRole('textbox', {
      name: 'Type to search',
    });
    this.buttonSearchRecord = page.locator('#basic-addon2'); //not needed but added for completeness
    this.tableRows = page.locator(
      '.rt-tbody .rt-tr:not(:has(span:only-child))'
    ); // added filter to exclude rows displayed without data (with only span child)
    this.tableCells = page.getByRole('gridcell');
    this.buttonEditRecord = page.getByTitle('Edit');
    this.buttonDeleteRecord = page.getByTitle('Delete');
    this.buttonPreviousPage = page.getByRole('button', { name: 'Previous' });
    this.buttonNextPage = page.getByRole('button', { name: 'Next' });
    this.inputJumpToPage = page.getByLabel('Jump to page');
    this.selectPagination = page.getByLabel('rows per page', { exact: true });
  }

  /************************
   * ACTION AND VALIDATIONS METHODS
   ************************/

  @when('User goes to Webtables page')
  async goToPage(): Promise<void> {
    await this.page.goto('/webtables');
    await expect(this.textPageHeader).toBeVisible();
  }

  @given('Webtable records are available for testing')
  async setWebtableRecords(count: number = 1): Promise<void> {
    for (let i = 0; i < count; i++) {
      const testData = GenerateWebtableData.validData();
      await this.createNewRecord(testData);
    }
  }

  @and('Clean up @autotest Webtable records')
  async cleanUpWebtableRecords(): Promise<void> {
    const autoTestEmails = await this.tableRows
      .filter({ hasText: '@autotest.com' })
      .locator(this.tableCells.nth(3))
      .allTextContents();
    for (const rowEmail of autoTestEmails) {
      await this.clickRecordDeleteButton(rowEmail);
    }
  }

  @when('User click on Add new record button')
  async clickAddNewRecordButton(): Promise<RegistrationFormModal> {
    await this.buttonAddRecord.click();
    return new RegistrationFormModal(this.page);
  }

  @when('User Creates a new record to the table - {0}')
  async createNewRecord(data: WebtableRecord): Promise<void> {
    const regForm = await this.clickAddNewRecordButton();
    await regForm.shouldBeVisible();
    await regForm.fillForm(data);
    await regForm.clickSubmitForm();
    this.data[data.email] = data; //store added record in data
  }

  @when('User clicks edit for {0} record')
  async clickRecordEditButton(email: string): Promise<RegistrationFormModal> {
    await this.tableRows
      .filter({ hasText: email })
      .locator(this.buttonEditRecord)
      .click();
    return new RegistrationFormModal(this.page);
  }

  @when('User edits an existing record for {0} with {1}')
  async editExistingRecord(
    email: string,
    data: Partial<WebtableRecord>
  ): Promise<WebtableRecord> {
    const regForm = await this.clickRecordEditButton(email);
    await regForm.fillForm(data);
    await regForm.clickSubmitForm();
    this.data[email] = { ...this.data[email], ...data };
    return this.data[email];
  }

  // assumption email is unique identifier for record (records does not have ids)
  @then('Record should be displayed in the table - {0}')
  async recordShouldBeDisplayed(data: WebtableRecord): Promise<void> {
    const recordRow = this.tableRows.filter({ hasText: data.email });
    await expect(
      recordRow,
      `Record with email ${data.email} should be visible`
    ).toBeVisible();
    // Verify other fields - ideally rows should have identifier to avoid relying on order
    await expect(
      recordRow.locator(this.tableCells).nth(0),
      `Record first name should be ${data.firstName}`
    ).toHaveText(data.firstName);
    await expect(
      recordRow.locator(this.tableCells).nth(1),
      `Record last name should be ${data.lastName}`
    ).toHaveText(data.lastName);
    await expect(
      recordRow.locator(this.tableCells).nth(2),
      `Record age should be ${data.age}`
    ).toHaveText(data.age.toString());
    await expect(
      recordRow.locator(this.tableCells).nth(3),
      `Record email should be ${data.email}`
    ).toHaveText(data.email);
    await expect(
      recordRow.locator(this.tableCells).nth(4),
      `Record salary should be ${data.salary}`
    ).toHaveText(data.salary.toString());
    await expect(
      recordRow.locator(this.tableCells).nth(5),
      `Record department should be ${data.department}`
    ).toHaveText(data.department);
  }

  @then('Record should NOT be displayed in the table - {0}')
  async recordShouldNotBeDisplayed(email: string): Promise<void> {
    const recordRow = this.tableRows.filter({ hasText: email });
    await expect(
      recordRow,
      `Record with email ${email} should NOT be visible`
    ).not.toBeVisible();
  }

  @when('User searches for record with text - {0}')
  async searchForRecord(searchText: string) {
    await this.inputSearchRecord.fill(searchText);
  }

  @then('Only records matching - {0} should be displayed in the table')
  async onlyMatchingRecordsShouldBeDisplayed(searchText: string) {
    const rowCount = await this.tableRows.count();
    await expect(
      this.tableRows.filter({ hasText: searchText }),
      `Only records matching ${searchText} should be displayed`
    ).toHaveCount(rowCount);
  }

  @when('User deletes {0} record from the webtable')
  async clickRecordDeleteButton(email: string): Promise<void> {
    await this.tableRows
      .filter({ hasText: email })
      .locator(this.buttonDeleteRecord)
      .click();
  }
}
