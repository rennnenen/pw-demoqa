import { test as base } from '@playwright/test';
import { WebtablePage } from '@pages/elements/WebtablePage';
import { PracticeFormPage } from '@pages/forms/PracticeFormPage';
import { SelectMenuPage } from '@pages/widgets/SelectMenuPage';

type POMFixtures = {
  webTablePage: WebtablePage;
  practiceFormPage: PracticeFormPage;
  selectMenuPage: SelectMenuPage;
};

/**
 * Extended Playwright test harness that provides page-object fixtures for UI tests.
 *
 * @summary
 * Exports a `test` object created via `base.extend<POMFixtures>` that injects three
 * page-object fixtures into each test: `webTablePage`, `practiceFormPage`, and
 * `selectMenuPage`.
 *
 * @remarks
 * - `webTablePage`: Instantiates a WebtablePage, navigates to the web table page,
 *   seeds the table with 3 records before the test, yields the page object to the
 *   test, and performs cleanup (removes seeded records) after the test completes.
 * - `practiceFormPage`: Instantiates a PracticeFormPage, navigates to the practice
 *   form page, and yields the page object for use in the test.
 * - `selectMenuPage`: Instantiates a SelectMenuPage, navigates to the select menu
 *   page, and yields the page object for use in the test.
 *
 * Each fixture follows Playwright's async fixture pattern and is scoped per-test;
 * callers receive the prepared page-object instance via the `use` callback.
 *
 * @example
 * // Importing and using the extended test fixture in a spec:
 * // import { test, expect } from './POMFixtures';
 * // test('interacts with web table', async ({ webTablePage }) => {
 * //   await webTablePage.doSomething();
 * //   expect(await webTablePage.getCount()).toBe(3);
 * // });
 *
 * @public
 */
export const test = base.extend<POMFixtures>({
  webTablePage: async ({ page }, use) => {
    const webtablePage = new WebtablePage(page);
    await webtablePage.goToPage();
    await webtablePage.setWebtableRecords(3);
    await use(webtablePage);
    await webtablePage.cleanUpWebtableRecords();
  },

  practiceFormPage: async ({ page }, use) => {
    const practiceFormPage = new PracticeFormPage(page);
    await practiceFormPage.goToPage();
    await use(practiceFormPage);
  },
  selectMenuPage: async ({ page }, use) => {
    const selectMenuPage = new SelectMenuPage(page);
    await selectMenuPage.goToPage();
    await use(selectMenuPage);
  },
});

export { expect } from '@playwright/test';
