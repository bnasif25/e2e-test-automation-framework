import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logger } from '../utils/logger';

export class ProductsPage extends BasePage {
    private readonly inventoryList: Locator;
    private readonly sortDropdown: Locator;
    private readonly cartBadge: Locator;

    constructor(page: Page) {
        super(page, '/inventory.html');
        this.inventoryList = page.locator('.inventory_list');
        this.sortDropdown = page.locator('[data-test="product_sort_container"]');
        this.cartBadge = page.locator('.shopping_cart_badge');
    }

    /**
     * Add product to cart by name
     * @param productName 
     */
    async addProductToCart(productName: string) {
        logger.info(`Adding product to cart: ${productName}`);
        const productSlug = productName.toLowerCase().replace(/ /g, '-');
        await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
    }

    /**
     * Remove product from cart by name
     * @param productName 
     */
    async removeProductFromCart(productName: string) {
        logger.info(`Removing product from cart: ${productName}`);
        const productSlug = productName.toLowerCase().replace(/ /g, '-');
        await this.page.locator(`[data-test="remove-${productSlug}"]`).click();
    }

    /**
     * Get number of items in cart
     */
    async getCartItemCount(): Promise<number> {
        if (await this.cartBadge.isVisible()) {
            const count = await this.cartBadge.textContent();
            return parseInt(count || '0', 10);
        }
        return 0;
    }

    /**
     * Sort products by option
     * @param option value of the option (az, za, lohi, hilo)
     */
    async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
        logger.info(`Sorting products by: ${option}`);
        await this.sortDropdown.selectOption(option);
    }
}
