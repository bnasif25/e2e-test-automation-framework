import { test, expect } from '../../../fixtures/test-users.fixture.js';
import { TEST_DATA } from '../../../config/test-data.js';

test.describe('Login Functionality @smoke', () => {
    test('should login successfully with standard user', async ({ loginPage, page }) => {
        await loginPage.goto();
        await loginPage.login(process.env.STANDARD_USER!, process.env.PASSWORD!);
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('should show error for locked out user', async ({ loginPage }) => {
        await loginPage.goto();
        await loginPage.login(process.env.LOCKED_OUT_USER!, process.env.PASSWORD!);
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
