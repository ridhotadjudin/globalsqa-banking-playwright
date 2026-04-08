import path from "path";
import { mkdir } from "fs/promises";

export const SCREENSHOTS_DIR = path.join(process.cwd(), "screenshots");

export async function ensureScreenshotsDir(): Promise<void> {
  await mkdir(SCREENSHOTS_DIR, { recursive: true });
}

export function formatDollarAmount(amount: number): string {
  return `$${amount}`;
}

export function parseAmount(text: string): number {
  const value = parseInt(text, 10);
  if (isNaN(value)) {
    throw new Error(`Unable to parse amount from text: "${text}"`);
  }
  return value;
}
