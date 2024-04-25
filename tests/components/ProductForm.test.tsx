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

  const renderComponent = (product?: Product) => {
    const onSubmit = vi.fn();
    render(<ProductForm product={product} onSubmit={onSubmit} />, { wrapper: AllProviders });

    return {
      waitForFormLoad: async () => {
        await screen.findByRole('form');

        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole('combobox', { name: /category/i })
        };
      }
    };
  };

  test('should render form fields', async () => {
    const { waitForFormLoad } = renderComponent();
    const { nameInput, priceInput, categoryInput } = await waitForFormLoad();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  test('should populate form fields when editing a product', async () => {
    product = { id: 1, name: 'Product 1', price: 10, categoryId: category.id };
    const { waitForFormLoad } = renderComponent(product);
    const { nameInput, priceInput, categoryInput } = await waitForFormLoad();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
  });
});
