const { chromium } = require('playwright');

(async () => {
  const url = process.argv[2];
  const outPath = process.argv[3];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: outPath, fullPage: false });
  await browser.close();
})();
