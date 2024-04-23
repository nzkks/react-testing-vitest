import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { QueryClient, QueryClientProvider } from 'react-query';

import { server } from '../mocks/server';
import { db } from '../mocks/db';
import ProductList from '../../src/components/ProductList';

describe('ProductList', () => {
  const productIds: number[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  const renderComponent = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );
  };

  test('should render list of products', async () => {
    renderComponent();

    const items = await screen.findAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  });

  test('should render no products available if no product is found', async () => {
    server.use(http.get('/products', () => HttpResponse.json([])));

    renderComponent();

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });

  test('should render an error message when there is an error', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    renderComponent();

    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  });

  test('should render a loading indicator when fetching data', async () => {
    server.use(
      http.get('/products', async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  test('should remove the loading indicator after data is fetched', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  test('should remove the loading indicator if data fetching fails', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
