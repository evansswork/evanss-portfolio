// Audit aksesibilitas otomatis (axe-core, aturan WCAG 2.1 A/AA) di halaman dan di dialog utama.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const scan = (page) => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).exclude('#hero-canvas').analyze();
const summary = (r) => r.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length}× — ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);

test('page has no WCAG A/AA violations', async ({ page }) => {
  await page.goto('/?opening=none');
  await expect(page.locator('#hero-title')).toBeVisible();
  // gulir sampai bawah supaya semua elemen "muncul saat di-scroll" selesai beranimasi
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
  await page.waitForTimeout(1200);
  const result = await scan(page);
  expect(summary(result)).toEqual([]);
});

test('case study dialog has no WCAG A/AA violations', async ({ page }) => {
  await page.goto('/?opening=none#case-youthentic');
  await expect(page.locator('#modal.is-open')).toBeVisible();
  await page.waitForTimeout(1500);
  expect(summary(await scan(page))).toEqual([]);
});

test('CV sheet has no WCAG A/AA violations', async ({ page }) => {
  await page.goto('/?opening=none#cv');
  await expect(page.locator('#cv.is-open')).toBeVisible();
  await page.waitForTimeout(1000);
  expect(summary(await scan(page))).toEqual([]);
});
