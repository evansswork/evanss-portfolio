// Alur utama yang harus selalu jalan. Dijalankan di desktop (1440×900) dan mobile (Pixel 7).
import { test, expect } from '@playwright/test';

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  return errors;
}

test('home renders and the default opening finishes without errors', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('/');
  await expect(page.locator('.opening')).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator('#hero-title')).toBeVisible();
  await expect(page.locator('#hero-nametag')).toBeVisible();
  expect(errors).toEqual([]);
});

test('opening plays fully once per session, then a short version', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.opening--edit')).toBeVisible();
  await expect(page.locator('.opening')).toHaveCount(0, { timeout: 15_000 });
  await page.reload();
  await expect(page.locator('.oe-caption')).toHaveText('Welcome back.', { timeout: 5_000 });
  await expect(page.locator('.opening')).toHaveCount(0, { timeout: 5_000 });
});

test('opening can be skipped with a key press', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.opening--edit')).toBeVisible();
  await page.keyboard.press('Space');
  await expect(page.locator('.opening')).toHaveCount(0, { timeout: 3_000 });
  await expect(page.locator('#hero-title')).toBeVisible();
});

test('layout never scrolls sideways', async ({ page }) => {
  await page.goto('/?opening=none');
  await expect(page.locator('#hero-title')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('case study opens from a card, moves to the next one and deep-links', async ({ page }) => {
  await page.goto('/?opening=none');
  await page.locator('.project__card[data-case="youthentic"]').click();
  await expect(page.locator('#modal.is-open')).toBeVisible();
  await expect(page).toHaveURL(/#case-youthentic$/);
  await expect(page.locator('.chart').first()).toBeVisible();
  await page.locator('.case__navbtn--next').click();
  await expect(page).toHaveURL(/#case-stimuler$/);
  await page.goBack(); // tombol Back browser menutup modal, bukan meninggalkan situs
  await expect(page.locator('#modal.is-open')).toHaveCount(0);
  await expect(page).not.toHaveURL(/#case-/);
  await page.goto('/?opening=none#case-natashagan'); // link yang ditempel di halaman yang sama
  await expect(page.locator('#modal.is-open #modal-title')).toHaveText('Natasha Gan');
});

test('background is inert while a dialog is open', async ({ page }) => {
  await page.goto('/?opening=none#case-digiflix');
  await expect(page.locator('#modal.is-open')).toBeVisible();
  expect(await page.evaluate(() => document.querySelector('#main').inert)).toBe(true);
  await page.keyboard.press('Escape');
  await expect.poll(() => page.evaluate(() => document.querySelector('#main').inert)).toBe(false);
});

test('TODO markers stay hidden from visitors', async ({ page }) => {
  await page.goto('/?opening=none#case-elite-scrim');
  await expect(page.locator('#modal.is-open')).toBeVisible();
  await expect(page.locator('#modal .todo-tag').first()).toBeHidden();
  await expect(page.locator('.medal:visible')).toHaveCount(3);
});

test('skill stickers open their evidence panel', async ({ page }) => {
  await page.goto('/?opening=none');
  await page.locator('.skill', { hasText: 'Livestreaming' }).click();
  await expect(page.locator('#evidence')).toBeVisible();
  await expect(page.locator('.evidence__item')).toHaveCount(3);
});

test('both CV versions use standard ATS sections and full month-year dates', async ({ page }) => {
  await page.goto('/?opening=none#cv');
  const cv = page.locator('#cv');
  await expect(cv).toBeVisible();
  for (const name of ['Summary', 'Skills', 'Experience', 'Achievements', 'Leadership & Activities', 'Education', 'Certifications']) {
    await expect(cv.getByRole('heading', { name, exact: true })).toBeVisible();
  }
  // tidak ada tanggal "Jul – Aug 2026" (bulan tanpa tahun); setiap rentang = "Mon YYYY – …"
  const text = await page.locator('#cv-sheet').innerText();
  expect(text).not.toMatch(/\b[A-Z][a-z]{2} – [A-Z][a-z]{2} \d{4}/);
  expect(text).not.toMatch(/\bI (blend|build|own)\b/); // summary tanpa kata ganti "I"
  await page.locator('[data-cv-version="tech"]').click();
  await expect(page).toHaveURL(/#cv-tech$/);
  await expect(cv.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.title)).toContain('CV-Tech');
});

test('"Hiring for" tailors the page and is shareable', async ({ page }) => {
  await page.goto('/?opening=none');
  await page.locator('[data-focus-option="tech"]').click();
  await expect(page).toHaveURL(/[?&]for=tech/);
  await expect(page.locator('#hero-title')).toContainText(/Code that|Models that/);
  await expect(page.locator('#process')).toBeHidden();
  await expect(page.locator('.tabs__btn[data-tab="it"]')).toHaveAttribute('aria-selected', 'true');
  await page.goto('/?opening=none&for=marketing');
  await expect(page.locator('[data-focus-option="marketing"]')).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#process')).toBeVisible();
});

test('case study opens with a five-second summary', async ({ page }) => {
  await page.goto('/?opening=none#case-natashagan');
  const tldr = page.locator('#modal .case__tldr');
  await expect(tldr).toBeVisible();
  await expect(tldr).toContainText('Role');
  await expect(tldr).toContainText('Challenge');
  await expect(tldr).toContainText('Outcome');
});

test('command palette jumps to a case study', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard shortcut is a desktop feature');
  await page.goto('/?opening=none');
  await expect(page.locator('#hero-title')).toBeVisible();
  await page.keyboard.press('Control+k');
  await expect(page.locator('#cmdk.is-open')).toBeVisible();
  await page.keyboard.type('spaceshare');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#case-spaceshare$/);
});
