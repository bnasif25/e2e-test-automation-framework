import { faker } from '@faker-js/faker';

export class DataFactory {
    static createRandomUser() {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            postalCode: faker.location.zipCode(),
        };
    }

    static createRandomProduct() {
        return {
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.commerce.productDescription(),
        };
    }
}
