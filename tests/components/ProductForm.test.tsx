import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
      expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
        const error = screen.getByRole('alert');
        expect(error).toBeInTheDocument();
        expect(error).toHaveTextContent(errorMessage);
      },
      waitForFormLoad: async () => {
        await screen.findByRole('form');

        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole('combobox', { name: /category/i }),
          submitButton: screen.getByRole('button', { name: /submit/i })
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

  test('should put focus on the name field', async () => {
    const { waitForFormLoad } = renderComponent();
    const { nameInput } = await waitForFormLoad();
    expect(nameInput).toHaveFocus(); // OR if only one textbox: expect(document.activeElement).toBe(nameInput);
  });

  test.each([
    { scenario: 'missing', errorMessage: /required/i },
    { scenario: '0', price: 0, errorMessage: /1/ },
    { scenario: 'negative', price: -1, errorMessage: /1/ },
    { scenario: 'greater than 1000', price: 1001, errorMessage: /1000/ },
    { scenario: 'not a number', price: 'a', errorMessage: /required/ }
  ])('should display an error if price is $scenario', async ({ price, errorMessage }) => {
    const userEvt = userEvent.setup();
    const { expectErrorToBeInTheDocument, waitForFormLoad } = renderComponent();

    const form = await waitForFormLoad();
    await userEvt.type(form.nameInput, 'a');
    if (price !== undefined) await userEvt.type(form.priceInput, price.toString());
    await userEvt.click(form.categoryInput);
    const options = screen.getAllByRole('option');
    await userEvt.click(options[0]);
    await userEvt.click(form.submitButton);

    expectErrorToBeInTheDocument(errorMessage);
  });
});
