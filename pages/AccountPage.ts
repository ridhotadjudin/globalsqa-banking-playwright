import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AccountPage extends BasePage {
  readonly transactionsTab: Locator;
  readonly depositTab: Locator;
  readonly withdrawlTab: Locator;
  readonly amountInput: Locator;
  readonly submitButton: Locator;
  readonly message: Locator;
  readonly welcomeMessage: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);

    this.transactionsTab = page.locator('[ng-click="transactions()"]');
    this.depositTab = page.locator('[ng-click="deposit()"]');
    this.withdrawlTab = page.locator('[ng-click="withdrawl()"]');

    this.amountInput = page.locator('input[ng-model="amount"]');
    this.submitButton = page.locator('form button[type="submit"]');

    this.message = page.locator("span.error");

    this.welcomeMessage = page.locator(".fontBig");

    this.logoutButton = page.getByRole("button", { name: "Logout" });
  }

  async getBalance(): Promise<number> {
    const centerText =
      (await this.page.locator("div.center").first().textContent()) ?? "";
    const match = centerText.match(/Balance\s*:\s*(\d+)/);
    if (!match) {
      throw new Error(
        `Could not parse balance from account info: "${centerText}"`,
      );
    }
    return parseInt(match[1], 10);
  }

  async deposit(amount: string): Promise<void> {
    await this.depositTab.click();
    await this.amountInput.fill(amount);
    await this.submitButton.click();
  }

  async withdraw(amount: string): Promise<void> {
    await this.withdrawlTab.click();
    await this.amountInput.fill(amount);
    await this.submitButton.click();
  }

  async goToTransactions(): Promise<void> {
    await this.transactionsTab.click();

    await this.page.waitForURL(/listTx/, { timeout: 10_000 });
  }

  async getMessage(): Promise<string> {
    return (await this.message.textContent()) ?? "";
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}