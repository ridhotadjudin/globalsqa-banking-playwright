import { test, expect, loginAsCustomer } from "../fixtures";
import {
  DEFAULT_CUSTOMER,
  AMOUNTS,
  TRANSACTION_TYPES,
} from "../utils/testData";

test.describe("Deposit flow", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginAsCustomer(loginPage, DEFAULT_CUSTOMER);
  });

  test("should deposit $100 and verify transaction exists @smoke", async ({
    accountPage,
    transactionsPage,
  }) => {
    // Screenshot after successful login
    await accountPage.takeScreenshot("01-after-login");

    await accountPage.deposit(AMOUNTS.standardDeposit);

    // Verify the deposit success message appears
    await expect(accountPage.message).toHaveText("Deposit Successful");
    await accountPage.takeScreenshot("02-after-deposit");

    await accountPage.page.waitForTimeout(1000);

    await accountPage.goToTransactions();

    await expect(transactionsPage.transactionTable).toBeVisible({
      timeout: 10_000,
    });

    // Specific column assertions
    const depositRow = transactionsPage.getTransactionRow(
      AMOUNTS.standardDeposit,
      TRANSACTION_TYPES.credit,
    );

    await expect(depositRow.first()).toBeVisible({ timeout: 10_000 });

    // Additional assertion, verify there is at least one transaction in the table
    const rowCount = await transactionsPage.getTransactionCount();
    expect(rowCount).toBeGreaterThanOrEqual(1);
    await transactionsPage.takeScreenshot("03-transactions-view");
  });
});
