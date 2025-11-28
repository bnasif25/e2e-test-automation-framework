import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logger } from '../utils/logger';

export class CheckoutPage extends BasePage {
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly postalCodeInput: Locator;
    private readonly continueButton: Locator;
    private readonly finishButton: Locator;
    private readonly completeHeader: Locator;

    constructor(page: Page) {
        super(page, '/checkout-step-one.html');
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.completeHeader = page.locator('.complete-header');
    }

    /**
     * Fill checkout information
     * @param firstName 
     * @param lastName 
     * @param postalCode 
     */
    async fillInformation(firstName: string, lastName: string, postalCode: string) {
        logger.info(`Filling checkout info: ${firstName} ${lastName}`);
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    /**
     * Continue to next step
     */
    async continueCheckout() {
        await this.continueButton.click();
    }

    /**
     * Finish checkout
     */
    async finishCheckout() {
        logger.info('Finishing checkout');
        await this.finishButton.click();
    }

    /**
     * Get order completion message
     */
    async getOrderSuccessMessage() {
        return await this.completeHeader.textContent();
    }
}
