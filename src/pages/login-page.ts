import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logger } from '../utils/logger';

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

    /**
     * Fill login form and submit
     * @param username - Valid username from test data
     * @param password - User's password
     * @throws {Error} If credentials are invalid or empty
     * @precondition Login page must be loaded and form visible
     * @postcondition User is on inventory page OR error message is visible
     */
    async login(username: string, password: string): Promise<void> {
        // ✅ CRITICAL FIX: Validate inputs (defensive programming)
        if (!username || username === 'undefined') {
            throw new Error(`Invalid username provided: "${username}". Check process.env.STANDARD_USER is set.`);
        }
        if (!password || password === 'undefined') {
            throw new Error(`Invalid password provided: "${password}". Check process.env.PASSWORD is set.`);
        }

        logger.info(`Logging in with user: ${username}`);
        
        // ✅ CRITICAL FIX: Clear fields first (WebKit compatibility)
        await this.usernameInput.clear();
        await this.usernameInput.fill(username);
        
        await this.passwordInput.clear();
        await this.passwordInput.fill(password);
        
        // ✅ CRITICAL FIX: Wait for button to be enabled
        await this.loginButton.waitFor({ state: 'enabled', timeout: 5000 });
        await this.loginButton.click();
        
        // ✅ CRITICAL FIX: Wait for EITHER navigation OR error (race condition handling)
        await Promise.race([
            this.page.waitForURL(/.*inventory.html/, { timeout: 10000 }),
            this.errorMessage.waitFor({ state: 'visible', timeout: 10000 })
        ]);
    }

    /**
     * Get error message text
     * @returns Error message content
     * @throws {Error} If error message element is not found
     */
    async getErrorMessage(): Promise<string> {
        await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
        const message = await this.errorMessage.textContent();
        logger.error(`Login error: ${message}`);
        return message || '';
    }
}
