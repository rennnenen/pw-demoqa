import { test } from '@fixtures/POMFixtures';
import { GenerateSelectMenuData } from '@fixtures/testdata/GenerateSelectMenuData';

test.describe(
  'Widgets > Select Menu page',
  { tag: ['@widgets', '@select-menu'] },
  () => {
    test(
      'should be able to select options from multiple select types',
      { tag: ['@TC21'] },
      async ({ selectMenuPage }) => {
        // Get random options for each select menu type
        const testData = GenerateSelectMenuData.randomOptions();

        // Select options from each select menu type
        await selectMenuPage.selectFromSelectValueOption(testData.selectValue);
        await selectMenuPage.selectFromSelectOneOption(testData.selectOne);
        await selectMenuPage.selectFromMultiSelectDropDownOption(
          testData.multiSelect
        );
        // BUG: No field to validate selected option
        // await selectMenuPage.selectFromStandardMultiSelectOption(
        //   testData.stdMultiSelect
        // );
      }
    );
  }
);
