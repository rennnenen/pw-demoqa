import { expect, Locator, Page } from '@playwright/test';
import { step } from '@utils/Decorators';
import {
  ERROR_CSS_PROPERTY,
  ERROR_CSS_VALUE,
} from '@utils/constants/GlobalConstants';
import { WebtableRecord } from '@utils/interfaces/WebtableRecordInterface';

// Export type for WebtableField
export type WebtableField = keyof WebtableRecord;

// Page object model class for Registration Form Modal
export class RegistrationFormModal {
  // Define locators
  private readonly container: Locator;
  private readonly buttonClose: Locator;
  private readonly inputFirstName: Locator;
  private readonly inputLastName: Locator;
  private readonly inputEmail: Locator;
  private readonly inputAge: Locator;
  private readonly inputSalary: Locator;
  private readonly inputDepartment: Locator;
  private readonly buttonSubmit: Locator;
  private readonly fields: Record<WebtableField, Locator>;

  // Initialize page and locators
  constructor(private readonly page: Page) {
    this.container = page.locator('.modal-content');
    this.buttonClose = page.getByRole('button', { name: 'Close' });
    this.inputFirstName = page.getByRole('textbox', { name: 'First Name' });
    this.inputLastName = page.getByRole('textbox', { name: 'Last Name' });
    this.inputEmail = page.getByRole('textbox', { name: 'name@example.com' });
    this.inputAge = page.getByRole('textbox', { name: 'Age' });
    this.inputSalary = page.getByRole('textbox', { name: 'Salary' });
    this.inputDepartment = page.getByRole('textbox', { name: 'Department' });
    this.buttonSubmit = page.getByRole('button', { name: 'Submit' });
    this.fields = {
      firstName: this.inputFirstName,
      lastName: this.inputLastName,
      email: this.inputEmail,
      age: this.inputAge,
      salary: this.inputSalary,
      department: this.inputDepartment,
    };
  }

  /************************
   * ACTION AND VALIDATIONS METHODS
   ************************/

  async shouldBeVisible(): Promise<void> {
    await expect(this.container).toBeVisible();
  }

  @step()
  async fillForm(data: Partial<WebtableRecord>): Promise<void> {
    for (const [key, value] of Object.entries(data)) {
      if (!!value) await this.fields[key as WebtableField].fill(value);
    }
  }

  @step()
  async clearField(field: WebtableField | WebtableField[]): Promise<void> {
    const fields = Array.isArray(field) ? field : [field];
    for (const field of fields) {
      await this.fields[field].clear();
    }
  }

  @step()
  async shouldDisplayFieldError(
    field: WebtableField | WebtableField[]
  ): Promise<void> {
    const fields = Array.isArray(field) ? field : [field];
    for (const field of fields) {
      await expect
        .soft(this.fields[field], `Field ${field} should display an error`)
        .toHaveCSS(ERROR_CSS_PROPERTY, ERROR_CSS_VALUE);
    }
  }

  async clickSubmitForm(): Promise<void> {
    await this.buttonSubmit.click();
  }

  @step()
  async closeForm() {
    await this.buttonClose.click();
    await expect(this.container).not.toBeVisible();
  }
}
