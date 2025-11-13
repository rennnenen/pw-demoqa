import { Locator, Page } from '@playwright/test';
import { step } from '@utils/Decorators';

// A base page object model that includes common functionality across pages
export class BasePage {
  private readonly accordionGroup: Locator;
  private readonly menuList: Locator;

  constructor(protected readonly page: Page) {
    this.accordionGroup = page.locator('.accordion');
    this.menuList = page.locator('.menu-list');
  }

  @step()
  async goToHomePage() {
    await this.page.goto('/');
  }

  // navigate to pages using the accordion and menu list
  @step()
  async navigateToPage(section: string, pageName: string) {
    await this.accordionGroup.getByText(section, { exact: true }).click();
    await this.menuList.getByText(pageName, { exact: true }).click();
  }
}
