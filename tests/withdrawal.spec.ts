import { test, expect, loginAsCustomer } from "../fixtures";
import {
  DEFAULT_CUSTOMER,
  AMOUNTS,
  TRANSACTION_TYPES,
} from "../utils/testData";

test.describe("Withdrawal flow", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginAsCustomer(loginPage, DEFAULT_CUSTOMER);
  });
  test("should withdraw after deposit and verify transaction @smoke", async ({
    accountPage,
    transactionsPage,
  }) => {
    await accountPage.deposit(AMOUNTS.standardDeposit);
    await expect(accountPage.message).toHaveText("Deposit Successful");
    
    const balanceAfterDeposit = await accountPage.getBalance();
    
    await accountPage.withdrawlTab.click();
    await expect(accountPage.amountInput).toBeVisible();
    
    // Wait for the old deposit message to clear before submitting
    await expect(accountPage.message).toBeHidden();
    await accountPage.amountInput.fill(AMOUNTS.standardWithdrawal);
    await accountPage.submitButton.click();
    await expect(accountPage.message).toHaveText("Transaction successful");
    await accountPage.takeScreenshot("04-after-withdrawal");
    
    // Verify balance decreased by the withdrawal amount
    const balanceAfterWithdrawal = await accountPage.getBalance();
    expect(balanceAfterWithdrawal).toBeLessThan(balanceAfterDeposit);
    expect(balanceAfterWithdrawal).toBe(
      balanceAfterDeposit - parseInt(AMOUNTS.standardWithdrawal, 10),
    );

    // Navigate to transactions and verify both entries exist
    await accountPage.page.waitForTimeout(3000);
    await accountPage.goToTransactions();

    await expect(transactionsPage.transactionTable).toBeVisible({
      timeout: 10_000,
    });

    // Verify the Debit (withdrawal) entry
    const withdrawalRow = transactionsPage.getTransactionRow(
      AMOUNTS.standardWithdrawal,
      TRANSACTION_TYPES.debit,
    );
    await expect(withdrawalRow.first()).toBeVisible({ timeout: 10_000 });

    // Verify the Credit (deposit) entry is also present
    const depositRow = transactionsPage.getTransactionRow(
      AMOUNTS.standardDeposit,
      TRANSACTION_TYPES.credit,
    );

    await expect(depositRow.first()).toBeVisible({ timeout: 10_000 });
    await transactionsPage.takeScreenshot("05-transactions-after-withdrawal");
  });

  test("should fail withdrawal when amount exceeds balance", async ({
    accountPage,
  }) => {
    await accountPage.withdraw("500");
    await expect(accountPage.message).toContainText("Transaction Failed");
    await accountPage.takeScreenshot("06-withdrawal-failed");
  });
});