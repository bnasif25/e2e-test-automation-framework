import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

// Load default test data if env vars are missing in CI
if (!process.env.STANDARD_USER) {
  console.warn('⚠️  STANDARD_USER not set, using default');
  process.env.STANDARD_USER = 'standard_user';
}
if (!process.env.PASSWORD) {
  console.warn('⚠️  PASSWORD not set, using default');
  process.env.PASSWORD = 'secret_sauce';
}
if (!process.env.LOCKED_OUT_USER) {
  process.env.LOCKED_OUT_USER = 'locked_out_user';
}

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : '50%',
  reporter: [['list'], ['html'], ['blob']],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  /* Global setup and teardown */
  // globalSetup: require.resolve('./src/config/global-setup'),
  // globalTeardown: require.resolve('./src/config/global-teardown'),
});
