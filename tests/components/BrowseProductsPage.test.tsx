import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

import { db } from '../mocks/db';
import { server } from '../mocks/server';
import { Category, Product } from '../../src/entities';
import { CartProvider } from '../../src/providers/CartProvider';
import BrowseProducts from '../../src/pages/BrowseProductsPage';

describe('BrowseProductsPage', () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      categories.push(db.category.create());
      products.push(db.product.create());
    });
  });

  afterAll(() => {
    const categoyIds = categories.map(category => category.id);
    db.category.deleteMany({ id: { in: categoyIds } });

    const productIds = products.map(product => product.id);
    db.product.deleteMany({ id: { in: productIds } });
  });

  const renderComponent = () => {
    render(
      <CartProvider>
        <Theme>
          <BrowseProducts />
        </Theme>
      </CartProvider>
    );
  };

  test('should show a loading skeleton when fetching categories', () => {
    server.use(
      http.get('/categories', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(screen.getByRole('progressbar', { name: /categories/i })).toBeInTheDocument();
  });

  test('should hide the loading skeleton after categories are fetched', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', { name: /categories/i }));
  });

  test('should show a loading skeleton when fetching products', () => {
    server.use(
      http.get('/products', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(screen.getByRole('progressbar', { name: /products/i })).toBeInTheDocument();
  });

  test('should hide the loading skeleton after products are fetched', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', { name: /products/i }));
  });

  test('should not render an error if categories cannot be fetched', async () => {
    server.use(http.get('/categories', () => HttpResponse.error()));

    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', { name: /categories/i }));

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: /category/i })).not.toBeInTheDocument();
  });

  test('should render an error if products cannot be fetched', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  // should render categories
  test('should render categories', async () => {
    const userEvt = userEvent.setup();
    renderComponent();

    const combobox = await screen.findByRole('combobox');
    expect(combobox).toBeInTheDocument();

    await userEvt.click(combobox);

    expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument();

    categories.forEach(category => {
      expect(screen.getByRole('option', { name: category.name })).toBeInTheDocument();
    });
  });

  // should render products
  test('should render products', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar', { name: /products/i }));

    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
