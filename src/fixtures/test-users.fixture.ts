import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login-page.js';

type UserFixtures = {
    loginPage: LoginPage;
    standardUserPage: Page;
};

export const test = base.extend<UserFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    standardUserPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(process.env.STANDARD_USER!, process.env.PASSWORD!);
        await use(page);
    },
});

export { expect } from '@playwright/test';
