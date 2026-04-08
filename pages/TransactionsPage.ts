import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class TransactionsPage extends BasePage {
  readonly transactionTable: Locator;
  readonly transactionRows: Locator;
  readonly backButton: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    super(page);
    this.transactionTable = page.locator("table.table");
    this.transactionRows = page.locator("table.table tbody tr");
    this.backButton = page.getByRole("button", { name: "Back" });
    this.resetButton = page.getByRole("button", { name: "Reset" });
  }

  async resetDateFilter(): Promise<void> {
    await this.resetButton.click();
  }

  async getTransactionCount(): Promise<number> {
    return this.transactionRows.count();
  }

  getTransactionRow(amount: string, type: string): Locator {
    return this.transactionRows
      .filter({
        has: this.page.locator("td:nth-child(2)", { hasText: amount }),
      })
      .filter({ has: this.page.locator("td:nth-child(3)", { hasText: type }) });
  }

  async goBack(): Promise<void> {
    await this.backButton.click();
  }
}