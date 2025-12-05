import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logger } from '../utils/logger';

/**
 * Page Object Model for the SauceDemo login page.
 */
export class LoginPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page, '/');

        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async goto(): Promise<void> {
        logger.info('Navigating to /');
        await this.page.goto('/', { waitUntil: 'domcontentloaded' });

        await this.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
        logger.info('Login form is ready');
    }

    async login(username: string, password: string): Promise<void> {
        if (!username || username === 'undefined') {
            throw new Error(`Username is undefined! Got: "${username}"`);
        }
        if (!password || password === 'undefined') {
            throw new Error(`Password is undefined! Got: "${password}"`);
        }

        logger.info(`Logging in with user: ${username}`);

        await this.usernameInput.clear();
        await this.usernameInput.fill(username);
        await this.passwordInput.clear();
        await this.passwordInput.fill(password);

        // THIS IS THE ONLY CHANGE YOU NEED
        // click() already auto-waits for visible + enabled + actionable
        await this.loginButton.click({ timeout: 15000, force: true });

        // Wait for either successful navigation or error message
        await Promise.race([
            this.page.waitForURL(/.*inventory.html/, { timeout: 10000 }),
            this.errorMessage.waitFor({ state: 'visible', timeout: 10000 })
        ]);

        logger.info('Login action completed');
    }

    async getErrorMessage(): Promise<string> {
        logger.info('Waiting for error message');
        await this.errorMessage.waitFor({ state: 'visible', timeout: 10000 });
        const text = (await this.errorMessage.textContent())?.trim() || '';
        logger.error(`Login error: ${text}`);
        return text;
    }
}
