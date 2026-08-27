const puppeteer = require('puppeteer');

const browser = await puppeteer.launch({
  args: [
    '--unlimited-storage',       // Removes storage quota caps for web storage and IndexedDB
    '--disable-dev-shm-usage',   // Writes shared memory to /tmp to prevent Docker quota crashes
    '--user-data-dir=./user_data' // Routes storage to disk instead of ephemeral memory
  ]
});

const page = await browser.newPage();

// Opt into persistent storage mode inside the browser context
await page.evaluate(async () => {
  if (navigator.storage?.persist) {
    await navigator.storage.persist();
  }
});
