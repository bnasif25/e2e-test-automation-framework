import { test, expect } from '../../../fixtures/test-users.fixture';
import { TEST_DATA } from '../../../config/test-data';

// ✅ CRITICAL FIX: Local fallbacks at the top
const USERNAME = process.env.STANDARD_USER || 'standard_user';
const PASSWORD = process.env.PASSWORD || 'secret_sauce';
const LOCKED_OUT_USERNAME = process.env.LOCKED_OUT_USER || 'locked_out_user';

test.describe('Login Functionality @smoke', () => {
  test('should login successfully with standard user', async ({ loginPage, page }) => {
    await loginPage.goto();
    
    // ✅ Use LOCAL constants
    await loginPage.login(USERNAME, PASSWORD);
    await expect(page).toHaveURL(/.*inventory.html/, { timeout: 10000 });
  });

  test('should show error for locked out user', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(LOCKED_OUT_USERNAME, PASSWORD);
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(TEST_DATA.errors.login.lockedOut);
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('invalid_user', 'invalid_pass');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(TEST_DATA.errors.login.invalid);
  });
});
