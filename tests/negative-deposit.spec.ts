import { test, expect, loginAsCustomer } from "../fixtures";
import { DEFAULT_CUSTOMER } from "../utils/testData";

test.describe("Negative deposit scenarios", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginAsCustomer(loginPage, DEFAULT_CUSTOMER);
  });

  test("should not show success message when deposit amount is empty", async ({
    accountPage,
  }) => {
    await accountPage.depositTab.click();

    await accountPage.submitButton.click();

    // The success message ("Deposit Successful") should NOT appear
    await expect(accountPage.message).not.toBeVisible();
    await accountPage.takeScreenshot("07-empty-deposit-attempt");
  });

  test("should not change balance when depositing zero", async ({
    accountPage,
  }) => {
    const initialBalance = await accountPage.getBalance();

    // Attempt to deposit 0
    await accountPage.depositTab.click();
    await accountPage.amountInput.fill("0");
    await accountPage.submitButton.click();

    // Balance should remain unchanged after a zero-value deposit
    const finalBalance = await accountPage.getBalance();
    expect(finalBalance).toBe(initialBalance);
    await accountPage.takeScreenshot("08-zero-deposit-attempt");
  });
});
