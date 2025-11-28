import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logger } from '../utils/logger';

export class CartPage extends BasePage {
    private readonly checkoutButton: Locator;
    private readonly cartItems: Locator;

    constructor(page: Page) {
        super(page, '/cart.html');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.cartItems = page.locator('.cart_item');
    }

    /**
     * Proceed to checkout
     */
    async checkout() {
        logger.info('Proceeding to checkout');
        await this.checkoutButton.click();
    }

    /**
     * Remove item from cart
     * @param productName 
     */
    async removeItem(productName: string) {
        logger.info(`Removing item from cart page: ${productName}`);
        const productSlug = productName.toLowerCase().replace(/ /g, '-');
        await this.page.locator(`[data-test="remove-${productSlug}"]`).click();
    }

    /**
     * Check if item is present in cart
     * @param productName 
     */
    async hasItem(productName: string): Promise<boolean> {
        return await this.page.locator(`text=${productName}`).isVisible();
    }
}
