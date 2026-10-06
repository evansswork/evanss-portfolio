# Membuat public/images/og.jpg dari scripts/og-image/og.html (butuh Python + Playwright).
#   pip install playwright && playwright install chromium
#   python scripts/og-image/generate.py
import asyncio, pathlib
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1200, 'height': 630}, device_scale_factor=1)
        await page.goto((ROOT / 'scripts/og-image/og.html').as_uri(), wait_until='networkidle')
        await page.evaluate('document.fonts.ready')
        out = ROOT / 'public/images/og.jpg'
        await page.screenshot(path=str(out), type='jpeg', quality=90)
        await browser.close()
        print('Saved', out)

asyncio.run(main())
