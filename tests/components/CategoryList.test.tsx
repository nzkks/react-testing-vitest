import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';

import CategoryList from '../../src/components/CategoryList';
import ReduxProvider from '../../src/providers/ReduxProvider';
import { db } from '../mocks/db';
import { Category } from '../../src/entities';
import { simulateDelay, simulateError } from '../utils';

describe('CategoryList', () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();
      categories.push(category);
    });
  });

  afterAll(() => {
    const categoryIds = categories.map(c => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });
  });

  const renderComponent = () =>
    render(
      <ReduxProvider>
        <CategoryList />
      </ReduxProvider>
    );

  test('should render an error message if fetching categories fails', async () => {
    simulateError('/categories');
    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  test('should render a loading message when fetching categories', () => {
    simulateDelay('/categories');
    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('should render a list of categories', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    categories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });
});
