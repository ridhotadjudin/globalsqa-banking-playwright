# GlobalSQA Banking App - Playwright E2E Tests

End-to-end UI tests for the [GlobalSQA AngularJS Banking Application](https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login) using **Playwright** with **TypeScript** and the **Page Object Model** pattern.

## Test Coverage

| Test File | Tests | Tags | Description |
|---|---|---|---|
| `deposit.spec.ts` | 1 | `@smoke` | Deposit $100, verify success message and transaction history |
| `withdrawal.spec.ts` | 2 | `@smoke` | Deposit then withdraw, verify balance math and transactions; insufficient funds rejection |
| `negative-deposit.spec.ts` | 2 | | Empty deposit (no amount) and zero deposit edge cases |

**5 tests total** across deposit, withdrawal, and negative-deposit scenarios. Screenshots are captured at key steps and saved to `screenshots/`.

---

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm (comes with Node.js)

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/ridhotadjudin/globalsqa-banking-playwright.git
cd globalsqa-banking-playwright

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. (CI / Linux only) Install OS-level browser dependencies
npx playwright install-deps
```

## Running Tests

```bash
# Run all tests (all browser projects)
npm test

# Run on a single browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run only @smoke-tagged tests
npm run test:smoke

# Run with visible browser
npm run test:headed

# Run with step-through debugger
npm run test:debug

# Run a single test file
npx playwright test tests/deposit.spec.ts

# Run a single test by title
npx playwright test -g "should deposit"
```

### Viewing Reports

```bash
# Open the HTML report from the last run
npm run report
```

Reports and failure artifacts (screenshots, videos, traces) are saved to `playwright-report/` and `test-results/`.

## Project Structure

```
.
├── tests/                          # Test specs
│   ├── deposit.spec.ts             # Deposit flow + transaction verification
│   ├── withdrawal.spec.ts          # Withdrawal flow + insufficient funds
│   └── negative-deposit.spec.ts    # Empty and zero deposit edge cases
├── pages/                          # Page Object Model classes
│   ├── BasePage.ts                 # Shared page helpers (navigate, screenshot)
│   ├── LoginPage.ts                # Customer login flow
│   ├── AccountPage.ts              # Deposit, withdrawal, balance, tab navigation
│   └── TransactionsPage.ts         # Transaction table queries and assertions
├── fixtures/                       # Custom Playwright fixtures
│   └── index.ts                    # Page object fixtures + loginAsCustomer helper
├── utils/                          # Helpers and constants
│   ├── testData.ts                 # Customer names, amounts, paths, transaction types
│   └── helpers.ts                  # Screenshot directory, formatting utilities
├── screenshots/                    # Step-by-step screenshots from test runs
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Scripts and dependencies
├── .prettierrc
```

## Page Object Model

All page interactions are encapsulated in classes under `pages/`:

- **BasePage** -- base class with `navigateTo()`, `takeScreenshot()`, shared by all pages.
- **LoginPage** -- selects a customer from the dropdown and logs in.
- **AccountPage** -- handles deposit/withdrawal tabs, entering amounts, reading balance, navigating to transactions.
- **TransactionsPage** -- queries the transaction table rows by amount and type (Credit/Debit).

Tests import page objects through custom Playwright fixtures defined in `fixtures/index.ts`, which also provides a `loginAsCustomer()` convenience function.

## Configuration

Key settings in `playwright.config.ts`:

| Setting | Value | Notes |
|---|---|---|
| `baseURL` | `https://www.globalsqa.com` | Tests use relative paths in `page.goto()` |
| `timeout` | 30s | Per-test timeout |
| `expect.timeout` | 5s | Assertion timeout |
| `actionTimeout` | 15s | Per-action timeout |
| `workers` | 2 (local), 1 (CI) | Limited to avoid overloading the external site |
| `retries` | 0 (local), 2 (CI) | Retries enabled in CI only |
| `trace` | `on-first-retry` | Trace captured on first retry for debugging |
| `projects` | Chromium, Firefox, WebKit | Three browser engines configured |

## Linting and Formatting

```bash
# Lint
npx eslint .
npx eslint --fix .

# Format
npx prettier --check .
npx prettier --write .

# Type-check
npm run typecheck
```

## CI Notes

- Install browsers with `npx playwright install --with-deps`
- Workers are automatically set to 1 in CI (`process.env.CI`)
- Retries are set to 2 in CI for resilience against external site flakiness
- Use `--shard=N/M` for parallel CI execution across multiple runners
- Upload `playwright-report/` and `test-results/` as build artifacts for debugging failures

## Known Considerations

- **External dependency** -- Tests run against a live external site (`globalsqa.com`). Network issues or site downtime can cause failures.
- **Transactions accumulate** -- The banking app does not reset between runs. Tests assert broadly (e.g., "at least one $100 Credit row exists") rather than exact row counts.
- **Date filter timing** -- The transactions page applies a date filter. A brief pause is used after deposit/withdrawal before navigating to transactions to ensure rows appear.
