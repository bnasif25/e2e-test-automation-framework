// tests/performance/load-test.js

// STEP 1: Import at top
import { browser } from 'k6/browser';
import { check, sleep } from 'k6';
import http from 'k6/http';

// STEP 2: Define config first
const BASE_URL = __ENV.BASE_URL || 'https://www.saucedemo.com';

// STEP 3: Export options as const
export const options = {
  scenarios: {
    ui_load: {
      executor: 'ramping-vus',
      exec: 'ui_load_test', // <-- Name matches function EXACTLY
      stages: [
        { duration: '30s', target: 5 }, // Short for testing
      ],
      options: { browser: { type: 'chromium' } },
    },
    api_load: {
      executor: 'ramping-vus',
      exec: 'api_load_test', // <-- Name matches function EXACTLY
      stages: [{ duration: '30s', target: 10 }],
    },
  },
};

// STEP 4: Export functions with EXACT names
export function ui_load_test() {
  // <-- No 'async' at top level!
  // Use async IIFE inside instead
  (async () => {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto(BASE_URL);
      await page.locator('[data-test="username"]').type('standard_user');
      await page.locator('[data-test="password"]').type('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      await page.waitForSelector('.inventory_list');

      check(page, {
        'login successful': () => page.url().includes('/inventory.html'),
      });

      sleep(1);
    } finally {
      await page.close();
      await context.close();
    }
  })(); // <-- Immediately invoke the async function
}

export function api_load_test() {
  // <-- No 'async' for API tests
  const res = http.get(BASE_URL);
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}

// STEP 5: Add fallback default function
export default function () {
  console.log('No scenario specified, running default...');
  api_load_test(); // Call the API test
}
// This will run if no specific scenario is invoked
