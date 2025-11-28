import { Page } from '@playwright/test';
import { logger } from '../utils/logger';

export abstract class BasePage {
    protected page: Page;
    protected url: string;

    constructor(page: Page, url: string) {
        this.page = page;
        this.url = url;
    }

    /**
     * Navigate to the page URL
     */
    async goto() {
        logger.info(`Navigating to ${this.url}`);
        await this.page.goto(this.url);
        await this.waitForLoad();
    }

    /**
     * Wait for page to load
     */
    async waitForLoad() {
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Get title of the page
     */
    async getTitle() {
        return await this.page.title();
    }

    /**
     * Handle error by logging and taking screenshot
     */
    protected async handleError(error: Error) {
        logger.error(`Error on page ${this.url}: ${error.message}`);
        throw error;
    }
}
