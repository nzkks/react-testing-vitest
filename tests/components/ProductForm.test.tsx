import { render, screen } from '@testing-library/react';
import ProductForm from '../../src/components/ProductForm';
import AllProviders from '../AllProviders';
import { Category, Product } from '../../src/entities';
import { db } from '../mocks/db';

describe('ProductForm', () => {
  let category: Category;
  let product: Product;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  test('should render form fields', async () => {
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProviders });

    await screen.findByRole('form');

    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
  });

  test('should populate form fields when editing a product', async () => {
    product = { id: 1, name: 'Product 1', price: 10, categoryId: category.id };
    render(<ProductForm product={product} onSubmit={vi.fn()} />, { wrapper: AllProviders });

    await screen.findByRole('form');

    expect(screen.getByPlaceholderText(/name/i)).toHaveValue(product.name);
    expect(screen.getByPlaceholderText(/price/i)).toHaveValue(product.price.toString());
    expect(screen.getByRole('combobox', { name: /category/i })).toHaveTextContent(category.name);
  });
});
