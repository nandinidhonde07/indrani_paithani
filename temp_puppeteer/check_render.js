const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));
  await page.goto('https://indrani-paithani.onrender.com', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'screenshot_render.png' });
  console.log('Page loaded and screenshot taken.');
  await browser.close();
})();
