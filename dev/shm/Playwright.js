const { chromium } = require('playwright');

// Launch persistent context directly for large file mounts
const context = await chromium.launchPersistentContext('./user_data', {
  args: [
    '--unlimited-storage',
    '--disable-dev-shm-usage'
  ]
});

const page = await context.newPage();

await page.evaluate(async () => {
  if (navigator.storage?.persist) {
    await navigator.storage.persist();
  }
});
