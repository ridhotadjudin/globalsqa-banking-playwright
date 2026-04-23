<!-- Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/Playwright-v1.50.0-45ba4b?style=flat-square&logo=playwright&logoColor=white" alt="Playwright" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
</p>

<h1 align="center">GlobalSQA Banking — Playwright Test Suite</h1>

<p align="center">
  End-to-end test automation for the <a href="https://www.globalsqa.com/angularJs-protractor/BankingProject/">GlobalSQA AngularJS Banking Application</a>, built with <strong>Playwright</strong>, <strong>TypeScript</strong>, and the <strong>Page Object Model</strong> design pattern.
</p>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Test Scenarios](#test-scenarios)
- [Design Patterns](#design-patterns)
- [Reports](#reports)
- [CI/CD](#cicd)
- [Author](#author)

---

## Features

- **Page Object Model** architecture for scalable, maintainable test code
- **Custom Playwright fixtures** for automatic page-object injection
- **Multi-browser coverage** across Chromium, Firefox, and WebKit
- **Smoke-tagged tests** for rapid regression feedback
- **Trace capture on first retry** for effortless failure debugging
- **Comprehensive edge-case coverage** including empty and zero-amount deposits
- **Parallel execution** with configurable worker count

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Playwright** | 1.50.0 | Browser automation and test runner |
| **TypeScript** | 5.x | Static typing and improved developer experience |
| **Node.js** | ≥ 18 | JavaScript runtime environment |
| **Playwright Test** | Built-in | Assertions, fixtures, and HTML reporting |

---

## Project Structure

```
globalsqa-banking-playwright/
├── pages/
│   ├── BasePage.ts              # Abstract base — shared navigation helpers
│   ├── LoginPage.ts             # Customer login and account selection
│   ├── AccountPage.ts           # Deposit, withdrawal, and balance actions
│   └── TransactionsPage.ts      # Transaction history and verification
├── tests/
│   ├── deposit.spec.ts          # Deposit success scenarios
│   ├── withdrawal.spec.ts       # Withdrawal with balance validation
│   └── negative-deposit.spec.ts # Edge cases — empty, zero, insufficient funds
├── fixtures/
│   └── base.ts                  # Custom fixtures for page-object injection
├── playwright.config.ts         # Multi-browser config, timeouts, retries
├── package.json
├── tsconfig.json
└── README.md
```

---

## Prerequisites

| Requirement | Minimum Version |
|---|---|
| Node.js | 18 or later |
| npm | 9 or later |

---

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/ridhotadjudin/globalsqa-banking-playwright.git
cd globalsqa-banking-playwright

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps
```

### Running Tests

| Script | Command | Description |
|---|---|---|
| **All tests** | `npm test` | Run the full suite across all configured browsers |
| **Chromium only** | `npm run test:chromium` | Execute against Chromium |
| **Firefox only** | `npm run test:firefox` | Execute against Firefox |
| **WebKit only** | `npm run test:webkit` | Execute against WebKit |
| **Headed mode** | `npm run test:headed` | Run with a visible browser window |
| **Debug mode** | `npm run test:debug` | Launch the Playwright Inspector |
| **Smoke tests** | `npm run test:smoke` | Run tests tagged `@smoke` for quick validation |
| **HTML report** | `npm run report` | Open the Playwright HTML report |

---

## Test Scenarios

| # | Scenario | Type | Tag | Description |
|---|---|---|---|---|
| 1 | Deposit $100 | Positive | `@smoke` | Log in as a customer, deposit $100, and verify the success message and updated balance |
| 2 | Withdrawal with balance check | Positive | — | Deposit funds, perform a withdrawal, and confirm the balance reflects the correct deduction |
| 3 | Insufficient funds withdrawal | Negative | — | Attempt to withdraw an amount exceeding the current balance and verify the transaction is rejected |
| 4 | Empty deposit field | Edge Case | — | Submit the deposit form with an empty amount field and validate that no transaction is recorded |
| 5 | Zero-amount deposit | Edge Case | — | Enter `0` as the deposit amount and confirm the application handles it gracefully without altering the balance |

---

## Design Patterns

### Page Object Model (POM)

Every page in the application is represented by a dedicated class that encapsulates its selectors and interactions. This separation keeps test logic clean and makes maintenance straightforward when the UI changes.

```
BasePage (abstract)
 ├── LoginPage        → navigateToLogin(), selectCustomer(), login()
 ├── AccountPage      → deposit(), withdraw(), getBalance(), getMessage()
 └── TransactionsPage → openTransactions(), getTransactionRows()
```

**Custom Fixtures** extend Playwright's built-in `test` object so that page instances are automatically created and injected into every test — no manual setup required:

```typescript
import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AccountPage } from "../pages/AccountPage";
import { TransactionsPage } from "../pages/TransactionsPage";

type Pages = {
  loginPage: LoginPage;
  accountPage: AccountPage;
  transactionsPage: TransactionsPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  accountPage: async ({ page }, use) => { await use(new AccountPage(page)); },
  transactionsPage: async ({ page }, use) => { await use(new TransactionsPage(page)); },
});
```

---

## Reports

Playwright's built-in **HTML Reporter** generates a detailed, interactive report after each run.

```bash
# Open the latest report
npm run report
```

Reports include:

- Test execution timeline with duration per spec
- Pass / fail / flaky breakdown by browser
- Screenshots and **trace files** captured on first retry for failed tests
- Filter and search across all test results

---

## CI/CD

The project is designed for seamless integration with **GitHub Actions**. A typical workflow runs the full suite across Chromium, Firefox, and WebKit on every push and pull request.

**Key configuration highlights** (`playwright.config.ts`):

| Setting | Value | Notes |
|---|---|---|
| Global timeout | 30 000 ms | Per-test maximum duration |
| Workers | 2 | Parallel test execution |
| Retries | 0 (local) · 2 (CI) | Automatic retries enabled in CI via `process.env.CI` |
| Trace | `on-first-retry` | Captured only when a test is retried for efficient debugging |
| Reporter | `html` | Interactive report generated after each run |

```yaml
# .github/workflows/playwright.yml (example)
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        project: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps ${{ matrix.project }}
      - run: npx playwright test --project=${{ matrix.project }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-${{ matrix.project }}
          path: playwright-report/
```

---

## Author

**Ridho Tadjudin** — QA Engineer

- 🌐 Website: [ridhotadjudin.id](https://ridhotadjudin.id)
- 💻 GitHub: [@ridhotadjudin](https://github.com/ridhotadjudin)

---

<p align="center">
  Built with ☕ and <a href="https://playwright.dev">Playwright</a>
</p>