"""Render internal/pdf-src/*.html to the published PDFs. Run from the repo root (bash):
python internal/pdf-src/render.py
Needs Playwright with Chromium (pip install playwright; python -m playwright install chromium)."""
import asyncio, pathlib
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).resolve().parents[2]
JOBS = {'internal/pdf-src/second-audience-how-we-work.html': 'docs/images/project_five/second-audience-how-we-work.pdf'}
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for src, out in JOBS.items():
            pg = await b.new_page()
            await pg.goto((ROOT / src).as_uri(), wait_until='networkidle')
            await pg.evaluate('document.fonts.ready')
            await pg.pdf(path=str(ROOT / out), format='A4', print_background=True, prefer_css_page_size=True)
            print('wrote', out)
        await b.close()
asyncio.run(main())
