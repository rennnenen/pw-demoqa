import { faker } from '@faker-js/faker';
import { test } from '@fixtures/POMFixtures';
import { GenerateWebtableData } from '@fixtures/testdata/GenerateWebtableData';
import { WebtableField } from '@pages/elements/RegistrationFormModal';
import { WebtableRecord } from '@utils/interfaces/WebtableRecordInterface';

test.describe(
  'Elements > Webtables Page',
  { tag: ['@elements', '@webtables'] },
  () => {
    test(
      'should be able to edit existing webtables record',
      { tag: ['@TC01'] },
      async ({ webTablePage }) => {
        // Randomly get test data to use from created @autotest web table records
        const testData = faker.helpers.arrayElement(
          Object.values(webTablePage.data)
        );

        // Filter table for the record to edit
        await webTablePage.searchForRecord(testData.email);

        // Edit existing record
        const updateRecord = {
          firstName: `${testData.firstName} Edited`,
          lastName: `${testData.lastName} Edited`,
          age: `${parseInt(testData.age) + 1}`,
          salary: GenerateWebtableData.salary(),
          department: GenerateWebtableData.department(),
        };
        const updatedData = await webTablePage.editExistingRecord(
          testData.email,
          updateRecord
        );

        // Updated record should be displayed
        await webTablePage.recordShouldBeDisplayed(updatedData);
      }
    );

    test(
      'should be able to validate form field inputs (email, age, salary)',
      { tag: ['@TC02'] },
      async ({ webTablePage }) => {
        // Randomly get test data to use from created @autotest web table records
        const testData = faker.helpers.arrayElement(
          Object.values(webTablePage.data)
        );
        // Generate invalid field values for form validation
        const invalidFields = GenerateWebtableData.invalidValues();

        // Edit existing record with invalid values
        const regForm = await webTablePage.clickRecordEditButton(
          testData.email
        );
        await regForm.fillForm(invalidFields);
        await regForm.clickSubmitForm();

        // Validate that error is displayed for invalid fields
        await regForm.shouldDisplayFieldError(
          Object.keys(invalidFields) as WebtableField[]
        );
        await regForm.closeForm();
      }
    );

    test(
      'should NOT be able to edit exiting webtable record with missing required fields',
      { tag: ['@TC03'] },
      async ({ webTablePage }) => {
        // Randomly get test data to use from created @autotest web table records
        const testData = faker.helpers.arrayElement(
          Object.values(webTablePage.data)
        );
        const requiredFields: WebtableField[] = [
          'firstName',
          'lastName',
          'email',
          'age',
          'salary',
          'department',
        ];

        // Edit existing record and clearing required fields
        const regForm = await webTablePage.clickRecordEditButton(
          testData.email
        );
        await regForm.clearField(requiredFields);
        await regForm.clickSubmitForm();

        // Validate that error is displayed for required fields
        await regForm.shouldDisplayFieldError(requiredFields);
        await regForm.closeForm();
      }
    );

    test(
      'should be able to cancel webtable record edit operation',
      { tag: ['@TC04'] },
      async ({ webTablePage }) => {
        // Randomly get test data to use from created @autotest web table records
        const testData = faker.helpers.arrayElement(
          Object.values(webTablePage.data)
        );

        // Filter table for the record to edit
        await webTablePage.searchForRecord(testData.email);

        // Edit existing record
        const updateRecord = {
          salary: GenerateWebtableData.salary(),
          department: GenerateWebtableData.department(),
        };
        const regForm = await webTablePage.clickRecordEditButton(
          testData.email
        );
        await regForm.fillForm(updateRecord);
        await regForm.closeForm();

        // Initial test data should still be displayed without changes
        await webTablePage.recordShouldBeDisplayed(testData);
      }
    );

    test(
      'should be able to delete webtable record',
      { tag: ['@TC05'] },
      async ({ webTablePage }) => {
        // randomly get test data to use from created @autotest web table records
        const testData = faker.helpers.arrayElement(
          Object.values(webTablePage.data)
        );

        // filter table for the record to delete
        await webTablePage.searchForRecord(testData.email);

        // delete existing record
        await webTablePage.clickRecordDeleteButton(testData.email);
        await webTablePage.recordShouldNotBeDisplayed(testData.email);
      }
    );
  }
);
