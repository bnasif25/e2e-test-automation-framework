export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
}

export const TEST_DATA = {
    products: {
        backpack: {
            id: 'sauce-labs-backpack',
            name: 'Sauce Labs Backpack',
            price: 29.99,
        },
        bikeLight: {
            id: 'sauce-labs-bike-light',
            name: 'Sauce Labs Bike Light',
            price: 9.99,
        },
    },
    errors: {
        login: {
            lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
            invalid: 'Epic sadface: Username and password do not match any user in this service',
        },
    },
};
