const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`CONSOLE ${msg.type().toUpperCase()}:`, msg.text());
    }
  });

  const fileUrl = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  console.log('Navigating to', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  
  await new Promise(r => setTimeout(r, 1000)); // wait for any async errors
  
  await browser.close();
})();
