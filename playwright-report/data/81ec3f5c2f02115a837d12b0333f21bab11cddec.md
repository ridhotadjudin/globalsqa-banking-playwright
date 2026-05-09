# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: withdrawal.spec.ts >> Withdrawal flow >> should withdraw after deposit and verify transaction @smoke
- Location: tests\withdrawal.spec.ts:21:7

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
          - text: 2026-04-08T21:53:13.473
        - textbox [ref=e14]:
          - /placeholder: yyyy-MM-ddTHH:mm:ss
          - text: 2026-04-08T21:53:13.962
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
  1  | /**
  2  |  * Withdrawal test for the GlobalSQA Banking App.
  3  |  *
  4  |  * Approach:
  5  |  * - First deposits money to ensure sufficient balance for withdrawal
  6  |  * - Withdraws a portion and verifies the balance decreased
  7  |  * - Navigates to transactions and confirms both Credit and Debit entries exist
  8  |  * - Includes a negative test for insufficient funds
  9  |  */
  10 | import { test, expect, loginAsCustomer } from "../fixtures";
  11 | import {
  12 |   DEFAULT_CUSTOMER,
  13 |   AMOUNTS,
  14 |   TRANSACTION_TYPES,
  15 | } from "../utils/testData";
  16 | 
  17 | test.describe("Withdrawal flow", () => {
  18 |   test.beforeEach(async ({ loginPage }) => {
  19 |     await loginAsCustomer(loginPage, DEFAULT_CUSTOMER);
  20 |   });
  21 |   test("should withdraw after deposit and verify transaction @smoke", async ({
  22 |     accountPage,
  23 |     transactionsPage,
  24 |   }) => {
  25 |     // Deposit first to ensure there is a balance to withdraw from
  26 |     await accountPage.deposit(AMOUNTS.standardDeposit);
  27 |     await expect(accountPage.message).toHaveText("Deposit Successful");
  28 |     
  29 |     // Record balance after deposit
  30 |     const balanceAfterDeposit = await accountPage.getBalance();
  31 |     
  32 |     // Withdraw a portion of the deposited amount
  33 |     // Wait for the Withdrawl tab form to be ready before interacting
  34 |     await accountPage.withdrawlTab.click();
  35 |     await expect(accountPage.amountInput).toBeVisible();
  36 |     
  37 |     // Wait for the old deposit message to clear before submitting
  38 |     await expect(accountPage.message).toBeHidden();
  39 |     await accountPage.amountInput.fill(AMOUNTS.standardWithdrawal);
  40 |     await accountPage.submitButton.click();
  41 |     await expect(accountPage.message).toHaveText("Transaction successful");
  42 |     await accountPage.takeScreenshot("04-after-withdrawal");
  43 |     
  44 |     // Verify balance decreased by the withdrawal amount
  45 |     const balanceAfterWithdrawal = await accountPage.getBalance();
  46 |     expect(balanceAfterWithdrawal).toBeLessThan(balanceAfterDeposit);
  47 |     expect(balanceAfterWithdrawal).toBe(
  48 |       balanceAfterDeposit - parseInt(AMOUNTS.standardWithdrawal, 10),
  49 |     );
  50 | 
  51 |     // Navigate to transactions and verify both entries exist
  52 |     // Brief pause so the transactions page date filter has a non-zero range
  53 |     // (the AngularJS app filters by startDate:end — when both timestamps are
  54 |     //  within the same second the range can be zero, hiding all rows)
  55 |     await accountPage.page.waitForTimeout(3000);
  56 |     await accountPage.goToTransactions();
  57 | 
  58 |     // Wait for the transactions table to render
  59 |     await expect(transactionsPage.transactionTable).toBeVisible({
  60 |       timeout: 10_000,
  61 |     });
  62 | 
  63 |     // Verify the Debit (withdrawal) entry
  64 |     const withdrawalRow = transactionsPage.getTransactionRow(
  65 |       AMOUNTS.standardWithdrawal,
  66 |       TRANSACTION_TYPES.debit,
  67 |     );
> 68 |     await expect(withdrawalRow.first()).toBeVisible({ timeout: 10_000 });
     |                                         ^ Error: expect(locator).toBeVisible() failed
  69 | 
  70 |     // Verify the Credit (deposit) entry is also present
  71 |     const depositRow = transactionsPage.getTransactionRow(
  72 |       AMOUNTS.standardDeposit,
  73 |       TRANSACTION_TYPES.credit,
  74 |     );
  75 | 
  76 |     await expect(depositRow.first()).toBeVisible({ timeout: 10_000 });
  77 |     await transactionsPage.takeScreenshot("05-transactions-after-withdrawal");
  78 |   });
  79 | 
  80 |   test("should fail withdrawal when amount exceeds balance", async ({
  81 |     accountPage,
  82 |   }) => {
  83 |     // The account starts with 0 balance in a fresh session, so any withdrawal should fail
  84 |     await accountPage.withdraw("500");
  85 |     await expect(accountPage.message).toContainText("Transaction Failed");
  86 |     await accountPage.takeScreenshot("06-withdrawal-failed");
  87 |   });
  88 | });
```