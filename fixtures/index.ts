import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AccountPage } from "../pages/AccountPage";
import { TransactionsPage } from "../pages/TransactionsPage";
import { DEFAULT_CUSTOMER } from "../utils/testData";

interface PageObjects {
  loginPage: LoginPage;
  accountPage: AccountPage;
  transactionsPage: TransactionsPage;
}

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  transactionsPage: async ({ page }, use) => {
    await use(new TransactionsPage(page));
  },
});

export async function loginAsCustomer(
  loginPage: LoginPage,
  customerName: string = DEFAULT_CUSTOMER,
): Promise<void> {
  await loginPage.goto();
  await loginPage.loginAsCustomer(customerName);
}

export { expect } from "@playwright/test";