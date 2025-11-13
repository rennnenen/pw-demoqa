# DemoQA End-to-End Tests (Playwright + TypeScript)

Playwright-based, TypeScript E2E test framework for https://demoqa.com covering Elements, Forms, and Widgets modules. It uses a Page Object Model (POM), typed test data generators, and produces HTML and JUnit reports.

- Test scenarios: see `docs/test-scenarios.md`
- Base URL: `https://demoqa.com/` (configured in `playwright.config.ts`)
- Browsers: Chromium, Firefox, WebKit
- Reports: HTML (`playwright-report/`) and JUnit XML (`test-results/junit-result.xml`)

## Prerequisites

- Node.js 18+ (recommended 20+)
- npm 9+ (ships with Node)

Verify versions (PowerShell):

```pwsh
node -v
npm -v
```

## Install

```pwsh
# From the repo root
npm ci
npx playwright install
```

## Run Tests

All browsers (default projects):

```pwsh
npm test
```

Single browser:

```pwsh
npx playwright test --project=chromium
# or
npx playwright test --project=firefox
npx playwright test --project=webkit
```

Specific file or folder:

```pwsh
npx playwright test tests/forms/PraticeForm.spec.ts
npx playwright test tests/elements
```

Filter by test title (e.g., run TC11 only):

```pwsh
npx playwright test -g "@TC11"
```

Headed / debug mode:

```pwsh
npx playwright test --project=chromium --headed
npx playwright test --debug
```

## Reports

- HTML report is generated automatically; open it with:

```pwsh
npx playwright show-report
```

    - Files live under `playwright-report/` (e.g., `playwright-report/index.html`).

- JUnit XML is written to `test-results/junit-result.xml` (useful for CI).

## Test Scenarios

This suite implements scenarios described in `docs/test-scenarios.md`:

- Elements → Webtables
- Forms → Practice Form
- Widgets → Select Menu

Refer to that file for the detailed list and IDs (e.g., TC01, TC11, TC21). You can target them with the `-g` title filter.

## Project Structure (overview)

```
.
├─ docs/                      # Scenario docs
├─ fixtures/                  # Reusable fixtures (POM wiring, etc.)
├─ pages/                     # Page Objects (BasePage, Elements, Forms, Widgets)
├─ tests/                     # Spec files grouped by module
├─ utils/                     # Decorators, constants, interfaces
├─ playwright.config.ts       # Test configuration (projects, reporters, baseURL)
└─ package.json               # Scripts and dev dependencies
```

Notable directories/files:

- `pages/` contains POM classes like `PracticeFormPage`, `SelectMenuPage`, `WebtablePage` and modal components.
- `fixtures/POMFixtures.ts` provides common fixture setup for tests.
- `utils/testdata/*` generates typed data via `@faker-js/faker`.
- `utils/constants/*` and `utils/interfaces/*` define shared constants and interfaces.

## Conventions

- Test titles include scenario IDs (e.g., TC01, TC11) to match `docs/test-scenarios.md`.
- Data generation uses `@faker-js/faker` and helpers under `utils/testdata`.
- Default timeout is 60s; traces are retained on failure (see `playwright.config.ts`).

## Creating Tests Scripts (POM + BDD Steps)

- Use the Page Object Model under `pages/` and import typed fixtures from `fixtures/POMFixtures.ts`.
- Decorate POM methods with `given/when/then/and/step` from `utils/BDDDecorators.ts` to auto-generate readable Playwright steps.

Example: decorate page methods

```ts
// pages/forms/PracticeFormPage.ts (excerpt)
import { step, when } from '@utils/BDDDecorators';

export class PracticeFormPage extends BasePage {
  @when('User goes to Practice Form page')
  async goToPage(): Promise<void> {
    await this.page.goto('/automation-practice-form');
  }

  @when('User fills the practice form with data - {0}')
  async fillForm(data: Partial<PracticeForm>): Promise<void> {
    // ... fill fields based on provided data
  }

  @step()
  async clickSubmit(): Promise<void> {
    await this.buttonSubmit.click();
  }
}
```

Example: write a spec using fixtures and POM

```ts
// tests/forms/PraticeForm.spec.ts (excerpt)
import { test, expect } from '@fixtures/POMFixtures';
import { GeneratePracticeFormData } from '@fixtures/testdata/GeneratePracticeFormData';

test('@TC11 - should be able to submit the form with complete data', async ({
  practiceFormPage,
}) => {
  const data = GeneratePracticeFormData.completeData();

  // Navigation is handled in the fixture, but explicit call also works:
  // await practiceFormPage.goToPage();

  await practiceFormPage.fillForm(data);
  await practiceFormPage.selectState(data.state);
  await practiceFormPage.selectCity(data.city);
  await practiceFormPage.clickSubmit();

  const modal = await practiceFormPage.shouldDisplayFormSubmittedModal();
  await modal.shouldDisplayExpectedFormData(data);
});
```

Notes on decorators

- Placeholders like `{0}`, `{1}` in the pattern are replaced by `JSON.stringify` of the corresponding argument.
- Without a pattern, the decorator creates a step name from the method name (e.g., `fillForm` → `Fill form`).
- This repo uses the modern (TypeScript 5+) decorators API; no extra `tsconfig` flags are needed.

## Troubleshooting

- If browsers are missing or updated, run:

```pwsh
npx playwright install
```

- To rerun failed tests locally with tracing:

```pwsh
npx playwright test --trace=on-first-retry
```
