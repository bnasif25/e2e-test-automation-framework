import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

// ✅ CRITICAL FIX: Add fallbacks directly in fixture (runs before config)
const STANDARD_USER = process.env.STANDARD_USER || 'standard_user';
const PASSWORD = process.env.PASSWORD || 'secret_sauce';
const LOCKED_OUT_USER = process.env.LOCKED_OUT_USER || 'locked_out_user';
const PROBLEM_USER = process.env.PROBLEM_USER || 'problem_user';
const PERFORMANCE_GLITCH_USER = process.env.PERFORMANCE_GLITCH_USER || 'performance_glitch_user';

// Debug logging to see what's happening
console.log('🔍 Fixture Environment Variables:');
console.log('STANDARD_USER:', STANDARD_USER);
console.log('PASSWORD:', PASSWORD ? '***' : 'MISSING');

export const test = baseTest.extend<{
  loginPage: LoginPage;
  productsPage: ProductsPage;
  standardUserPage: Page;
  lockedOutUserPage: Page;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },

  standardUserPage: async ({ browser }, use) => {
    console.log('🎭 Setting up standard user session...');
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    
    // ✅ Use local constants instead of process.env
    await page.goto('/');
    await loginPage.login(STANDARD_USER, PASSWORD);
    
    await use(page);
    
    await context.close();
  },

  lockedOutUserPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    
    // ✅ Use local constants
    await page.goto('/');
    await loginPage.login(LOCKED_OUT_USER, PASSWORD);
    
    await use(page);
    
    await context.close();
  },
});

export { expect } from '@playwright/test';
