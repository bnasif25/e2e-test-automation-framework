import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logger } from '../utils/logger';

/**
 * Page Object Model for the SauceDemo login page.
 * Handles user authentication with robust error handling and validation.
 */
export class LoginPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;

    /**
     * @param page - Playwright page instance
     */
    constructor(page: Page) {
        super(page, '/');
        
        // Initialize locators using data-test attributes for stability
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    /**
     * Navigate to the login page and wait for form to be ready.
     * @throws {Error} If login form is not visible within 5 seconds
     */
    async goto(): Promise<void> {
        logger.info('Navigating to /');
        await this.page.goto('/', { waitUntil: 'domcontentloaded' });
        
        // Wait for the username field to be visible and ready
        await this.usernameInput.waitFor({ 
            state: 'visible', 
            timeout: 5000 
        });
        
        logger.info('Login form is ready');
    }

    /**
     * Performs login action with robust validation and cross-browser compatibility.
     * @param username - Valid username from test data
     * @param password - User's password
     * @throws {Error} If credentials are undefined or login action fails
     * @returns {Promise<void>} Resolves when login completes or error appears
     */
    async login(username: string, password: string): Promise<void> {
        // ✅ CRITICAL: Runtime validation to catch undefined values
        if (!username || username === 'undefined') {
            throw new Error(
                `❌ Username is undefined! Check your fixture configuration. Got: "${username}"`
            );
        }
        if (!password || password === 'undefined') {
            throw new Error(
                `❌ Password is undefined! Check your fixture configuration. Got: "${password}"`
            );
        }

        logger.info(`Logging in with user: ${username}`);
        
        // ✅ WebKit compatibility: Clear fields before filling
        await this.usernameInput.clear();
        await this.usernameInput.fill(username);
        
        await this.passwordInput.clear();
        await this.passwordInput.fill(password);
        
       // New – Recommended way (clean, readable, and officially supported)
        await expect(this.loginButton).toBeEnabled({ timeout: 10000 });
        
        
        await this.loginButton.click();
        
        // ✅ CRITICAL: Race condition handling - wait for either navigation OR error
        // This ensures reliability across all browsers (especially WebKit)
        await Promise.race([
            this.page.waitForURL(/.*inventory.html/, { timeout: 10000 }),
            this.errorMessage.waitFor({ state: 'visible', timeout: 10000 })
        ]);
        
        logger.info('Login action completed');
    }

    /**
     * Retrieves the text content of any login error message.
     * @throws {Error} If error message element is not visible within 5 seconds
     * @returns {Promise<string>} The error message text
     */
    async getErrorMessage(): Promise<string> {
        logger.info('Waiting for error message');
        
        await this.errorMessage.waitFor({ 
            state: 'visible', 
            timeout: 5000 
        });
        
        const message = await this.errorMessage.textContent();
        const errorText = message || '';
        
        logger.error(`Login error retrieved: ${errorText}`);
        return errorText;
    }
}
