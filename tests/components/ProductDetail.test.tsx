import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import ProductDetail from '../../src/components/ProductDetail';
import { products } from '../mocks/data';
import { server } from '../mocks/server';

describe('ProductDetail', () => {
  test('should render an error for invalid productId', async () => {
    render(<ProductDetail productId={0} />);

    const message = await screen.findByText(/invalid/i);
    expect(message).toBeInTheDocument();
  });

  test('should render message if product not found', async () => {
    server.use(http.get('/products/1', () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });

  test('should render the list of products', async () => {
    render(<ProductDetail productId={1} />);

    expect(await screen.findByText(new RegExp(products[0].name))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(products[0].price.toString()))).toBeInTheDocument();
  });
});
