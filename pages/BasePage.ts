import { type Page } from "@playwright/test";
import path from "path";
import { ensureScreenshotsDir, SCREENSHOTS_DIR } from "../utils/helpers";

export class BasePage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async takeScreenshot(name: string): Promise<void> {
    await ensureScreenshotsDir();
    await this.page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `${name}.png`),
      fullPage: true,
    });
  }
}
