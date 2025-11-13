import { faker } from '@faker-js/faker';
import {
  MULTI_DROPDOWN_OPTIONS,
  MULTI_STANDARD_OPTIONS,
  OLD_SELECT_MENU_OPTIONS,
  SELECT_ONE_OPTIONS,
  SELECT_VALUE_OPTIONS,
} from '@utils/constants/SelectMenuConstants';
import { SelectMenu } from '@utils/interfaces/SelectMenuInterface';

/**
 * Utility class for producing randomized SelectMenu test data.
 *
 * Generates a SelectMenu-shaped object where each field is populated with
 * one or more randomly chosen options from the corresponding option arrays.
 *
 * @example
 * const data = GenerateSelectMenuData.randomOptions();
 * // data.selectValue -> e.g. "Blue"
 * // data.multiSelect -> e.g. ["Red", "Yellow"]
 */
export class GenerateSelectMenuData {
  static randomOptions(): SelectMenu {
    return {
      selectValue: faker.helpers.arrayElement(SELECT_VALUE_OPTIONS),
      selectOne: faker.helpers.arrayElement(SELECT_ONE_OPTIONS),
      oldStyleSelect: faker.helpers.arrayElement(OLD_SELECT_MENU_OPTIONS),
      multiSelect: faker.helpers.arrayElements(MULTI_DROPDOWN_OPTIONS),
      stdMultiSelect: faker.helpers.arrayElements(MULTI_STANDARD_OPTIONS),
    };
  }
}
