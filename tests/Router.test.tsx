import { screen } from '@testing-library/react';
import { navigateTo } from './utils';
import { db } from './mocks/db';

describe('Router', () => {
  test('should render the home page for /', () => {
    navigateTo('/');

    expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
  });

  test('should render the products page for /products', () => {
    navigateTo('/products');

    expect(screen.getByRole('heading', { name: /products/i })).toBeInTheDocument();
  });

  test('should render the product details page for /products/:id', async () => {
    const product = db.product.create();
    navigateTo(`/products/${product.id}`);

    expect(await screen.findByRole('heading', { name: product.name })).toBeInTheDocument();

    db.product.delete({ where: { id: { equals: product.id } } });
  });

  test('should render the not found page for invalid routes', () => {
    navigateTo('/invalid-route');

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  test('should render the admin home page for /admin', () => {
    navigateTo('/admin');

    expect(screen.getByRole('heading', { name: /admin/i })).toBeInTheDocument();
  });
});
