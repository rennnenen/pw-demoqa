import { faker } from '@faker-js/faker';
import { BasePage } from '@pages/BasePage';
import { expect, Locator, Page } from '@playwright/test';
import { then, when } from '@utils/Decorators';
import {
  MultiselectDropdownOption,
  MultiselectStandardOption,
  OldSelectMenuOption,
  SelectOneOption,
  SelectValueOption,
} from '@utils/constants/SelectMenuConstants';

// Page object model class for Select Menu page
export class SelectMenuPage extends BasePage {
  // Define locators
  private readonly textPageHeader: Locator;
  private readonly selectValueDiv: Locator;
  private readonly textSelectValue: Locator;
  private readonly selectOneDiv: Locator;
  private readonly textSelectOne: Locator;
  private readonly oldStyleSelectMenu: Locator;
  private readonly multiSelectDropDown: Locator;
  private readonly optionsMultiSelectDropDown: Locator;
  private readonly multiSelectSelectedValues: Locator;
  private readonly standardMultiSelect: Locator;

  // Initialize page and locators
  constructor(page: Page) {
    super(page);
    this.textPageHeader = page.getByRole('heading', { name: 'Select Menu' });
    this.selectValueDiv = page.locator('div#withOptGroup');
    this.textSelectValue = this.selectValueDiv.locator('[class*=singleValue]');
    this.selectOneDiv = page.locator('div#selectOne');
    this.textSelectOne = this.selectOneDiv.locator('[class*=singleValue]');
    this.oldStyleSelectMenu = page.locator('#oldSelectMenu');
    this.multiSelectDropDown = page.getByText('Select...');
    this.optionsMultiSelectDropDown = page.locator('div[id^=react-select-]');
    this.multiSelectSelectedValues = page.locator('.css-1rhbuit-multiValue');
    this.standardMultiSelect = page.locator('#cars');
  }

  /************************
   * ACTION AND VALIDATIONS METHODS
   ************************/

  @when('User goes to Select Menu page')
  async goToPage(): Promise<void> {
    await this.page.goto('/select-menu');
    await expect(this.textPageHeader).toBeVisible();
  }

  @when('User selects from Select Value option')
  async selectFromSelectValueOption(option: SelectValueOption): Promise<void> {
    await this.selectValueDiv.click();
    await this.selectValueDiv.getByText(option, { exact: true }).click();
    await expect(
      this.textSelectValue,
      `Selected value for Select value should be ${option}`
    ).toHaveText(option);
  }

  @when('User selects from Select One option')
  async selectFromSelectOneOption(option: SelectOneOption): Promise<void> {
    await this.selectOneDiv.click();
    await this.selectOneDiv.getByText(option, { exact: true }).click();
    await expect(
      this.textSelectOne,
      `Selected value for Select one should be ${option}`
    ).toHaveText(option);
  }

  @when('User selects from Old Style Select Menu option')
  async selectFromOldStyleSelectMenuOption(
    option: OldSelectMenuOption
  ): Promise<void> {
    await this.oldStyleSelectMenu.selectOption(option);
    await expect
      .soft(
        this.oldStyleSelectMenu,
        `Selected value for Old Style Select Menu should be ${option}`
      )
      .toHaveValue(option);
  }

  @when('User selects from Multi Select Drop Down option')
  async selectFromMultiSelectDropDownOption(
    option: MultiselectDropdownOption[]
  ): Promise<void> {
    await this.multiSelectDropDown.click();
    for (const opt of option) {
      await this.optionsMultiSelectDropDown.filter({ hasText: opt }).click();
      await expect
        .soft(
          this.multiSelectSelectedValues.filter({ hasText: opt }),
          `Selected value for Multi Select Drop Down should select ${opt}`
        )
        .toBeVisible();
    }
  }

  @when('User selects from Standard Multi Select option')
  async selectFromStandardMultiSelectOption(
    option: MultiselectStandardOption[]
  ): Promise<void> {
    await this.standardMultiSelect.selectOption(option);
    // BUG: No field to validate selected option
    // await expect
    //   .soft(
    //     this.standardMultiSelect,
    //     `Selected value for Standard Multi Select should select ${option}`
    //   )
    //   .toHaveValue(option);
  }
}
