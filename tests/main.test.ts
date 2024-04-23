import { faker } from '@faker-js/faker';

describe('group', () => {
  test('should', () => {
    console.log({
      name: faker.commerce.productName(),
      price: faker.commerce.price({ min: 1, max: 100 })
    });
  });
});
