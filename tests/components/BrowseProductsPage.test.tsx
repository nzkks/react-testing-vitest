import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { Theme } from '@radix-ui/themes';

import { server } from '../mocks/server';
import BrowseProducts from '../../src/pages/BrowseProductsPage';

describe('BrowseProductsPage', () => {
  const renderComponent = () => {
    render(
      <Theme>
        <BrowseProducts />
      </Theme>
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
});
