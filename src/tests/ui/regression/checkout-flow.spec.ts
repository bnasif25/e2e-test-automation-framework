import { test, expect } from '../../../fixtures/test-users.fixture.js';
import { ProductsPage } from '../../../pages/products-page.js';
import { CartPage } from '../../../pages/cart-page.js';
import { CheckoutPage } from '../../../pages/checkout-page.js';
import { DataFactory } from '../../../utils/data-factory.js';
import { TEST_DATA } from '../../../config/test-data.js';

test.describe('Checkout Flow @regression @critical', () => {
    test('should complete checkout process successfully', async ({ standardUserPage: _standardUserPage, page }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const product = TEST_DATA.products.backpack;

        // Add product to cart
        await productsPage.addProductToCart(product.name);
        expect(await productsPage.getCartItemCount()).toBe(1);

        // Go to cart
        await page.locator('.shopping_cart_link').click();
        expect(await cartPage.hasItem(product.name)).toBeTruthy();

        // Checkout
        await cartPage.checkout();

        // Fill info
        const user = DataFactory.createRandomUser();
        await checkoutPage.fillInformation(user.firstName, user.lastName, user.postalCode);
        await checkoutPage.continueCheckout();

        // Finish
        await checkoutPage.finishCheckout();
        expect(await checkoutPage.getOrderSuccessMessage()).toBe('Thank you for your order!');
    });
});
