const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));
  await page.goto('http://localhost:4174', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'screenshot_prod_mock.png' });
  console.log('Page loaded and screenshot taken.');
  await browser.close();
})();
