import { expect, Locator, Page } from '@playwright/test';
import { PracticeForm } from '@utils/interfaces/PracticeFormInterface';
import { format } from 'date-fns';

export class FormSubmittedModal {
  // Define locators
  private readonly container: Locator;
  private readonly textSubmittedMessage: Locator;
  private readonly rowStudentName: Locator;
  private readonly rowStudentEmail: Locator;
  private readonly rowGender: Locator;
  private readonly rowMobile: Locator;
  private readonly rowDateOfBirth: Locator;
  private readonly rowSubjects: Locator;
  private readonly rowHobbies: Locator;
  private readonly rowPicture: Locator;
  private readonly rowAddress: Locator;
  private readonly rowStateAndCity: Locator;

  // Initialize page and locators
  constructor(private readonly page: Page) {
    this.container = page.locator('.modal-content');
    this.textSubmittedMessage = page.locator('.modal-title');
    this.rowStudentName = page.getByRole('row', { name: 'Student Name' });
    this.rowStudentEmail = page.getByRole('row', { name: 'Student Email' });
    this.rowGender = page.getByRole('row', { name: 'Gender' });
    this.rowMobile = page.getByRole('row', { name: 'Mobile' });
    this.rowDateOfBirth = page.getByRole('row', { name: 'Date of Birth' });
    this.rowSubjects = page.getByRole('row', { name: 'Subjects' });
    this.rowHobbies = page.getByRole('row', { name: 'Hobbies' });
    this.rowPicture = page.getByRole('row', { name: 'Picture' });
    this.rowAddress = page.getByRole('row', { name: 'Address' });
    this.rowStateAndCity = page.getByRole('row', { name: 'State and City' });
  }

  /************************
   * VALIDATIONS METHODS
   ************************/

  async shouldBeVisible(): Promise<void> {
    await expect(this.container).toBeVisible();
  }

  async shouldDisplaySubmittedMessage(expectedMessage: string): Promise<void> {
    await expect(this.textSubmittedMessage).toHaveText(expectedMessage);
  }

  async shouldDisplayExpectedFormData(
    formData: Partial<PracticeForm>
  ): Promise<void> {
    if (formData.firstName && formData.lastName) {
      const expectedName = `${formData.firstName} ${formData.lastName}`;
      await expect(
        this.valueLocator(this.rowStudentName),
        `Student Name should be ${expectedName}`
      ).toHaveText(expectedName);
    }
    if (formData.email) {
      await expect(
        this.valueLocator(this.rowStudentEmail),
        `Student Email should be ${formData.email}`
      ).toHaveText(formData.email);
    }
    if (formData.gender) {
      await expect(
        this.valueLocator(this.rowGender),
        `Gender should be ${formData.gender}`
      ).toHaveText(formData.gender);
    }
    if (formData.mobile) {
      await expect(
        this.valueLocator(this.rowMobile),
        `Mobile should be ${formData.mobile}`
      ).toHaveText(formData.mobile);
    }
    if (formData.dateOfBirth) {
      const expectedDate = format(
        new Date(formData.dateOfBirth),
        'dd MMMM,yyyy'
      );
      await expect(
        this.valueLocator(this.rowDateOfBirth),
        `Date of Birth should be ${expectedDate}`
      ).toHaveText(expectedDate);
    }
    if (formData.subjects) {
      const expectedSubjects = formData.subjects.join(', ');
      await expect(
        this.valueLocator(this.rowSubjects),
        `Subjects should be ${expectedSubjects}`
      ).toHaveText(expectedSubjects);
    }
    if (formData.hobbies) {
      const expectedHobbies = formData.hobbies.join(', ');
      await expect(
        this.valueLocator(this.rowHobbies),
        `Hobbies should be ${expectedHobbies}`
      ).toHaveText(expectedHobbies);
    }
    if (formData.picture) {
      const expectedValue = formData.picture.split(/(\\|\/)/g).pop();
      await expect(
        this.valueLocator(this.rowPicture),
        `Picture should have a file name of ${expectedValue}`
      ).toHaveText(expectedValue!);
    }
    if (formData.address) {
      await expect(
        this.valueLocator(this.rowAddress),
        `Address should be ${formData.address}`
      ).toHaveText(formData.address);
    }
    if (formData.state && formData.city) {
      const expectedStateAndCity = `${formData.state} ${formData.city}`;
      await expect(
        this.valueLocator(this.rowStateAndCity),
        `State and City should be ${expectedStateAndCity}`
      ).toHaveText(expectedStateAndCity);
    }
  }

  valueLocator(row: Locator): Locator {
    return row.locator('td').nth(1);
  }

  async getValue(row: Locator): Promise<string> {
    return this.valueLocator(row).innerText();
  }
}
