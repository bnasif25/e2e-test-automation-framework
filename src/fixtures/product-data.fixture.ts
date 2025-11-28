import { TEST_DATA } from '../config/test-data';

export const productFixtures = {
    validProduct: TEST_DATA.products.backpack,
    anotherProduct: TEST_DATA.products.bikeLight,
    invalidProduct: {
        id: 'invalid-id',
        name: 'Non-existent Product',
        price: 0,
    },
};
