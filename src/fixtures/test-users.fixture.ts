import { test as base, Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

// ✅ CRITICAL FIX: Local fallbacks - runs before ANY other code
const STANDARD_USER = process.env.STANDARD_USER || 'standard_user';
const PASSWORD = process.env.PASSWORD || 'secret_sauce';
const LOCKED_OUT_USER = process.env.LOCKED_OUT_USER || 'locked_out_user';

// Debug logging to see what's actually being used
console.log('🔍 Fixture Environment Variables:');
console.log('STANDARD_USER:', STANDARD_USER);
console.log('PASSWORD:', PASSWORD ? '***' : 'MISSING');

type UserFixtures = {
  loginPage: LoginPage;
  standardUserPage: Page;
};

export const test = base.extend<UserFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  standardUserPage: async ({ browser }, use) => {
    console.log('🎭 Setting up standard user session...');
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    
    // ✅ Use LOCAL constants, not process.env
    await page.goto('/');
    await loginPage.login(STANDARD_USER, PASSWORD);
    
    // Verify login success
    try {
        await expect(page).toHaveURL(/.*inventory\.html/, { timeout: 10000 });
    } catch (e) {
        // If we're not on the inventory page, check if there's a login error
        const errorMsg = await page.locator('[data-test="error"]').textContent().catch(() => null);
        if (errorMsg) {
            throw new Error(`Login failed for user ${STANDARD_USER}: ${errorMsg}`);
        }
        throw e;
    }
    
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
