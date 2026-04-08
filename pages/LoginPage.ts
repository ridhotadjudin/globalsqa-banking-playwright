import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { APP_LOGIN_PATH } from "../utils/testData";

export class LoginPage extends BasePage {
  readonly customerLoginButton: Locator;
  readonly customerDropdown: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.customerLoginButton = page.getByRole("button", {
      name: "Customer Login",
    });
    this.customerDropdown = page.locator("#userSelect");
    this.loginButton = page.getByRole("button", { name: "Login" });
  }

  async goto(): Promise<void> {
    await this.navigateTo(APP_LOGIN_PATH);
  }

  async selectCustomer(customerName: string): Promise<void> {
    await this.customerDropdown.selectOption({ label: customerName });
  }

  async loginAsCustomer(customerName: string): Promise<void> {
    await this.customerLoginButton.click();
    await this.selectCustomer(customerName);
    await this.loginButton.click();
  }
}