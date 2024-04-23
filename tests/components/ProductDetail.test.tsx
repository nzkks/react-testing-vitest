import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';

import ProductDetail from '../../src/components/ProductDetail';
import { db } from '../mocks/db';
import { server } from '../mocks/server';
import AllProviders from '../AllProviders';

describe('ProductDetail', () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  test('should render an error for invalid productId', async () => {
    render(<ProductDetail productId={0} />, { wrapper: AllProviders });

    const message = await screen.findByText(/invalid/i);
    expect(message).toBeInTheDocument();
  });

  test('should render message if product not found', async () => {
    server.use(http.get('/products/1', () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });

  test('should render an error if data fetching fails', async () => {
    server.use(http.get('/products/1', () => HttpResponse.error()));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  test('should remove the loading indicator if data fetching fails', async () => {
    server.use(http.get('/products/1', () => HttpResponse.error()));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  test('should render a loading indicator when fetching data', async () => {
    server.use(
      http.get('/products/1', async () => {
        await delay();
        return HttpResponse.json({});
      })
    );

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  test('should remove the loading indicator after data is fetched', async () => {
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  test('should render product details', async () => {
    const product = db.product.findFirst({ where: { id: { equals: productId } } });
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    expect(await screen.findByText(new RegExp(product!.name))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(product!.price.toString()))).toBeInTheDocument();
  });
});
