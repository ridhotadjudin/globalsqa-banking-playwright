# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: withdrawal.spec.ts >> Withdrawal flow >> should withdraw after deposit and verify transaction @smoke
- Location: tests\withdrawal.spec.ts:12:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('table.table tbody tr').filter({ has: locator('td:nth-child(2)').filter({ hasText: '50' }) }).filter({ has: locator('td:nth-child(3)').filter({ hasText: 'Debit' }) }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('table.table tbody tr').filter({ has: locator('td:nth-child(2)').filter({ hasText: '50' }) }).filter({ has: locator('td:nth-child(3)').filter({ hasText: 'Debit' }) }).first()

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - button "Home" [ref=e5] [cursor=pointer]
    - strong [ref=e6]: XYZ Bank
    - button "Logout" [ref=e7] [cursor=pointer]
  - generic [ref=e9]:
    - generic [ref=e10]:
      - button "Back" [ref=e11] [cursor=pointer]
      - generic [ref=e12]:
        - textbox [ref=e13]:
          - /placeholder: yyyy-MM-ddTHH:mm:ss
          - text: 2026-04-21T20:47:33.415
        - textbox [ref=e14]:
          - /placeholder: yyyy-MM-ddTHH:mm:ss
          - text: 2026-04-21T20:47:33.873
      - button "Reset" [ref=e15] [cursor=pointer]
    - table [ref=e18]:
      - rowgroup [ref=e19]:
        - row "Date-Time Amount Transaction Type" [ref=e20]:
          - cell "Date-Time" [ref=e21]:
            - link "Date-Time" [ref=e22] [cursor=pointer]:
              - /url: "#"
          - cell "Amount" [ref=e23]
          - cell "Transaction Type" [ref=e24]
      - rowgroup
    - button ">" [ref=e26] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect, loginAsCustomer } from "../fixtures";
  2  | import {
  3  |   DEFAULT_CUSTOMER,
  4  |   AMOUNTS,
  5  |   TRANSACTION_TYPES,
  6  | } from "../utils/testData";
  7  | 
  8  | test.describe("Withdrawal flow", () => {
  9  |   test.beforeEach(async ({ loginPage }) => {
  10 |     await loginAsCustomer(loginPage, DEFAULT_CUSTOMER);
  11 |   });
  12 |   test("should withdraw after deposit and verify transaction @smoke", async ({
  13 |     accountPage,
  14 |     transactionsPage,
  15 |   }) => {
  16 |     await accountPage.deposit(AMOUNTS.standardDeposit);
  17 |     await expect(accountPage.message).toHaveText("Deposit Successful");
  18 |     
  19 |     const balanceAfterDeposit = await accountPage.getBalance();
  20 |     
  21 |     await accountPage.withdrawlTab.click();
  22 |     await expect(accountPage.amountInput).toBeVisible();
  23 |     
  24 |     // Wait for the old deposit message to clear before submitting
  25 |     await expect(accountPage.message).toBeHidden();
  26 |     await accountPage.amountInput.fill(AMOUNTS.standardWithdrawal);
  27 |     await accountPage.submitButton.click();
  28 |     await expect(accountPage.message).toHaveText("Transaction successful");
  29 |     await accountPage.takeScreenshot("04-after-withdrawal");
  30 |     
  31 |     // Verify balance decreased by the withdrawal amount
  32 |     const balanceAfterWithdrawal = await accountPage.getBalance();
  33 |     expect(balanceAfterWithdrawal).toBeLessThan(balanceAfterDeposit);
  34 |     expect(balanceAfterWithdrawal).toBe(
  35 |       balanceAfterDeposit - parseInt(AMOUNTS.standardWithdrawal, 10),
  36 |     );
  37 | 
  38 |     // Navigate to transactions and verify both entries exist
  39 |     await accountPage.page.waitForTimeout(3000);
  40 |     await accountPage.goToTransactions();
  41 | 
  42 |     await expect(transactionsPage.transactionTable).toBeVisible({
  43 |       timeout: 10_000,
  44 |     });
  45 | 
  46 |     // Verify the Debit (withdrawal) entry
  47 |     const withdrawalRow = transactionsPage.getTransactionRow(
  48 |       AMOUNTS.standardWithdrawal,
  49 |       TRANSACTION_TYPES.debit,
  50 |     );
> 51 |     await expect(withdrawalRow.first()).toBeVisible({ timeout: 10_000 });
     |                                         ^ Error: expect(locator).toBeVisible() failed
  52 | 
  53 |     // Verify the Credit (deposit) entry is also present
  54 |     const depositRow = transactionsPage.getTransactionRow(
  55 |       AMOUNTS.standardDeposit,
  56 |       TRANSACTION_TYPES.credit,
  57 |     );
  58 | 
  59 |     await expect(depositRow.first()).toBeVisible({ timeout: 10_000 });
  60 |     await transactionsPage.takeScreenshot("05-transactions-after-withdrawal");
  61 |   });
  62 | 
  63 |   test("should fail withdrawal when amount exceeds balance", async ({
  64 |     accountPage,
  65 |   }) => {
  66 |     await accountPage.withdraw("500");
  67 |     await expect(accountPage.message).toContainText("Transaction Failed");
  68 |     await accountPage.takeScreenshot("06-withdrawal-failed");
  69 |   });
  70 | });
```