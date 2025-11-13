import { BasePage } from '@pages/BasePage';
import { expect, Locator, Page } from '@playwright/test';
import { step, when } from '@utils/Decorators';
import {
  City,
  Gender,
  Hobby,
  State,
  Subject,
} from '@utils/constants/PracticeFormConstants';
import { PracticeForm } from '@utils/interfaces/PracticeFormInterface';
import { FormSubmittedModal } from './FormSubmittedModal';
import {
  ERROR_CSS_PROPERTY,
  ERROR_CSS_VALUE,
} from '@utils/constants/GlobalConstants';

export class PracticeFormPage extends BasePage {
  // Define locators
  private readonly textPageHeader: Locator;
  private readonly inputFirstName: Locator;
  private readonly inputLastName: Locator;
  private readonly inputEmail: Locator;
  private readonly inputMobileNumber: Locator;
  private readonly inputDateOfBirth: Locator;
  private readonly inputAutocompleteSubjects: Locator;
  private readonly optionAutoCompleteSubject: Locator;
  private readonly multiValueSelectedSubjects: Locator;
  private readonly buttonMultiValueSelectedRemove: Locator;
  private readonly fileInputUploadPicture: Locator;
  private readonly textAreaCurrentAddress: Locator;
  private readonly inputListState: Locator;
  private readonly inputListCity: Locator;
  private readonly buttonSubmit: Locator;
  private readonly radioButtonGender: (gender: Gender) => Locator;
  private readonly checkboxHobby: (hobby: Hobby) => Locator;
  private readonly optionListState: (state: State) => Locator;
  private readonly optionListCity: (city: City) => Locator;

  // Store practice form data for testing with email as the key
  data: { [key: string]: PracticeForm } = {};

  // Initialize page and locators
  constructor(page: Page) {
    super(page);
    this.textPageHeader = page.getByRole('heading', { name: 'Practice Form' });
    this.inputFirstName = page.locator('#firstName');
    this.inputLastName = page.getByRole('textbox', { name: 'Last Name' });
    this.inputEmail = page.getByRole('textbox', { name: 'name@example.com' });
    this.inputMobileNumber = page.getByRole('textbox', {
      name: 'Mobile Number',
    });
    this.inputDateOfBirth = page.locator('#dateOfBirthInput');
    this.inputAutocompleteSubjects = page.locator('#subjectsInput');
    this.optionAutoCompleteSubject = page.locator(
      '.subjects-auto-complete__option'
    );
    this.multiValueSelectedSubjects = page.locator(
      '.subjects-auto-complete__multi-value__label'
    );
    this.buttonMultiValueSelectedRemove = page.locator(
      '.subjects-auto-complete__multi-value__remove'
    );
    this.fileInputUploadPicture = page.locator('#uploadPicture');
    this.textAreaCurrentAddress = page.getByRole('textbox', {
      name: 'Current Address',
    });
    this.inputListState = page.getByText('Select State');
    this.inputListCity = page.getByText('Select City');
    this.buttonSubmit = page.getByRole('button', { name: 'Submit' });
    this.radioButtonGender = (gender: Gender) =>
      page.getByText(gender, { exact: true });
    this.checkboxHobby = (hobby: Hobby) => page.getByLabel(hobby);
    this.optionListState = (state: State) =>
      page.locator('#state').getByText(state, { exact: true });
    this.optionListCity = (city: City) =>
      page.locator('#city').getByText(city, { exact: true });
  }

  /************************
   * ACTION AND VALIDATIONS METHODS
   ************************/

  @when('User goes to Practice Form page')
  async goToPage(): Promise<void> {
    await this.page.goto('/automation-practice-form');
    await expect(this.textPageHeader).toBeVisible();
  }

  @when('User fills the practice form with data - {0}')
  async fillForm(data: Partial<PracticeForm>): Promise<void> {
    if (data.firstName) await this.inputFirstName.fill(data.firstName);
    if (data.lastName) await this.inputLastName.fill(data.lastName);
    if (data.email) await this.inputEmail.fill(data.email);
    if (data.gender) await this.selectGender(data.gender);
    if (data.mobile) await this.inputMobileNumber.fill(data.mobile);
    if (data.dateOfBirth) await this.inputDateOfBirth.fill(data.dateOfBirth);
    if (data.subjects) await this.selectSubjects(data.subjects);
    if (data.hobbies) await this.checkHobbies(data.hobbies);
    if (data.picture) await this.setPictureInputFile(data.picture);
    if (data.address) await this.textAreaCurrentAddress.fill(data.address);
    if (data.state) await this.selectState(data.state);
    if (data.city) await this.selectCity(data.city);
  }

  @step()
  async clearFirstName(): Promise<void> {
    await this.inputFirstName.clear();
  }

  @step()
  async clearLastName(): Promise<void> {
    await this.inputLastName.clear();
  }

  @step()
  async clearMobile(): Promise<void> {
    await this.inputMobileNumber.clear();
  }

  private async shouldDisplayError(locator: Locator): Promise<void> {
    await expect(locator).toHaveCSS(ERROR_CSS_PROPERTY, ERROR_CSS_VALUE);
  }

  @step()
  async shouldDisplayErrorInFirstNameField() {
    await this.shouldDisplayError(this.inputFirstName);
  }

  @step()
  async shouldDisplayErrorInLastNameField() {
    await this.shouldDisplayError(this.inputLastName);
  }

  @step()
  async shouldDisplayErrorInMobileNumberField() {
    await this.shouldDisplayError(this.inputMobileNumber);
  }

  @step()
  async shouldDisplayErrorInEmailField() {
    await this.shouldDisplayError(this.inputEmail);
  }

  @step()
  async selectGender(gender: Gender): Promise<void> {
    await this.radioButtonGender(gender).click();
  }

  @step()
  async selectSubjects(subjects: Subject[]): Promise<void> {
    for (const subject of subjects) {
      await this.inputAutocompleteSubjects.fill(subject);
      await this.optionAutoCompleteSubject.filter({ hasText: subject }).click();
    }
  }

  @step()
  async clearSubjects(subjects: Subject[]): Promise<void> {
    for (const subject of subjects) {
      const toClear = this.multiValueSelectedSubjects
        .filter({ hasText: subject })
        .first();
      await toClear.locator(this.buttonMultiValueSelectedRemove).click();
      await expect.soft(toClear).not.toBeVisible();
    }
  }

  @step()
  async checkHobbies(hobbies: Hobby[]): Promise<void> {
    for (const hobby of hobbies) {
      await expect(async () => {
        await this.checkboxHobby(hobby).click({ force: true });
        await expect(this.checkboxHobby(hobby)).toBeChecked({ timeout: 1_000 });
      }).toPass({ timeout: 5_000 });
    }
  }

  @step()
  async uncheckHobbies(hobbies: Hobby[]): Promise<void> {
    for (const hobby of hobbies) {
      await this.page.getByLabel(hobby).uncheck();
    }
  }

  @step()
  async setPictureInputFile(filePath: string): Promise<void> {
    await this.fileInputUploadPicture.setInputFiles(filePath);
  }

  @step()
  async selectState(state: State): Promise<void> {
    await this.inputListState.click();
    await this.optionListState(state).click();
  }

  @step()
  async selectCity(city: City): Promise<void> {
    await this.inputListCity.click();
    await this.optionListCity(city).click();
  }

  @step()
  async clickSubmit(): Promise<void> {
    await this.buttonSubmit.click();
  }

  @step()
  async shouldDisplayFormSubmittedModal(): Promise<FormSubmittedModal> {
    const formSubmittedModal = new FormSubmittedModal(this.page);
    await formSubmittedModal.shouldBeVisible();
    return formSubmittedModal;
  }
}
