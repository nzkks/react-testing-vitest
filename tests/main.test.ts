import { render, screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { db } from './mocks/db';

describe('group', () => {
  test('should', () => {
    const products = db.product.create({ name: 'Samsung' });
    console.log(db.product.delete({ where: { id: { equals: products.id } } }));
  });
});
