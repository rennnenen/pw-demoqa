import { test } from '@fixtures/POMFixtures';
import { GeneratePracticeFormData } from '@fixtures/testdata/GeneratePracticeFormData';

test.describe(
  'Forms > Practice Forms page',
  { tag: ['@forms', '@practice-forms'] },
  () => {
    test(
      'should be able to submit the form with complete data',
      { tag: ['@TC11'] },
      async ({ practiceFormPage }) => {
        // Generate random complete form data
        const testData = GeneratePracticeFormData.completeData();

        // Fill the form with generated data
        await practiceFormPage.fillForm(testData);
        await practiceFormPage.clickSubmit();

        // Verify that the form submitted modal is displayed with expected data
        const formModal =
          await practiceFormPage.shouldDisplayFormSubmittedModal();
        await formModal.shouldDisplayExpectedFormData(testData);
      }
    );

    test(
      'should be able to submit form with only required fields',
      { tag: ['@TC12'] },
      async ({ practiceFormPage }) => {
        // Generate random required form data
        const testData = GeneratePracticeFormData.requiredData();

        // Fill the form with generated data
        await practiceFormPage.fillForm(testData);
        await practiceFormPage.clickSubmit();

        // Verify that the form submitted modal is displayed with expected data
        const formModal =
          await practiceFormPage.shouldDisplayFormSubmittedModal();
        await formModal.shouldDisplayExpectedFormData(testData);
      }
    );

    test(
      'should NOT be able to submit form with missing required fields',
      { tag: ['@TC13'] },
      async ({ practiceFormPage }) => {
        // Generate random complete form data
        const testData = GeneratePracticeFormData.completeData();

        // Fill the form with generated data
        await practiceFormPage.fillForm(testData);
        await practiceFormPage.clearFirstName();
        await practiceFormPage.clearLastName();
        await practiceFormPage.clearMobile();
        await practiceFormPage.clickSubmit();

        // Verify that errors are displayed for missing required fields
        await practiceFormPage.shouldDisplayErrorInFirstNameField();
        await practiceFormPage.shouldDisplayErrorInLastNameField();
        await practiceFormPage.shouldDisplayErrorInMobileNumberField();
      }
    );

    test(
      'should be able to validate form field inputs (email, mobile)',
      { tag: ['@TC14'] },
      async ({ practiceFormPage }) => {
        // Generate random complete form data
        const testData = GeneratePracticeFormData.invalidData();

        // Fill the form with generated data
        await practiceFormPage.fillForm(testData);
        await practiceFormPage.clickSubmit();

        // Verify that errors are displayed for missing required fields
        await practiceFormPage.shouldDisplayErrorInMobileNumberField();
        await practiceFormPage.shouldDisplayErrorInEmailField();
      }
    );
  }
);
