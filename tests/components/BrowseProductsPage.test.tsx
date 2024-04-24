import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

import { db, getProductsBycategoryId } from '../mocks/db';
import { Category, Product } from '../../src/entities';
import { CartProvider } from '../../src/providers/CartProvider';
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { simulateDelay, simulateError } from '../utils';

describe('BrowseProductsPage', () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();
      categories.push(category);

      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map(c => c.id);
    db.category.deleteMany({ id: { in: categoryIds } });

    const productIds = products.map(p => p.id);
    db.product.deleteMany({ id: { in: productIds } });
  });

  test('should show a loading skeleton when fetching categories', () => {
    simulateDelay('/categories');
    const { getCategoriesSkeleton } = renderComponent();
    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  test('should hide the loading skeleton after categories are fetched', async () => {
    const { getCategoriesSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  test('should show a loading skeleton when fetching products', () => {
    simulateDelay('/products');
    const { getProductsSkeleton } = renderComponent();
    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  test('should hide the loading skeleton after products are fetched', async () => {
    const { getProductsSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  test('should not render an error if categories cannot be fetched', async () => {
    simulateError('/categories');
    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(getCategoriesCombobox()).not.toBeInTheDocument();
  });

  test('should render an error if products cannot be fetched', async () => {
    simulateError('/products');
    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  test('should render categories', async () => {
    const userEvt = userEvent.setup();
    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesCombobox();
    expect(combobox).toBeInTheDocument();

    await userEvt.click(combobox!);

    expect(screen.getByRole('option', { name: /all/i })).toBeInTheDocument();

    categories.forEach(category => {
      expect(screen.getByRole('option', { name: category.name })).toBeInTheDocument();
    });
  });

  test('should render products', async () => {
    const { getProductsSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  test('should filter products by category', async () => {
    const { expectProductsToBeInTheDocument, selectCategory } = renderComponent();

    const selectedCategory = categories[0];
    await selectCategory(selectedCategory.name);

    const products = getProductsBycategoryId(selectedCategory.id);
    expectProductsToBeInTheDocument(products);
  });

  test('should render all products if All category is selected', async () => {
    const { expectProductsToBeInTheDocument, selectCategory } = renderComponent();

    await selectCategory(/all/i);

    const products = db.product.getAll();
    expectProductsToBeInTheDocument(products);
  });
});

const renderComponent = () => {
  render(
    <CartProvider>
      <Theme>
        <BrowseProducts />
      </Theme>
    </CartProvider>
  );

  const getCategoriesSkeleton = () => screen.queryByRole('progressbar', { name: /categories/i });
  const getProductsSkeleton = () => screen.queryByRole('progressbar', { name: /products/i });
  const getCategoriesCombobox = () => screen.queryByRole('combobox');

  const selectCategory = async (name: RegExp | string) => {
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const combobox = getCategoriesCombobox();
    const userEvt = userEvent.setup();
    await userEvt.click(combobox!);
    const option = screen.getByRole('option', { name });
    await userEvent.click(option);
  };

  const expectProductsToBeInTheDocument = (products: Product[]) => {
    const rows = screen.getAllByRole('row');
    const dataRows = rows.slice(1); // skip the header row
    expect(dataRows).toHaveLength(products.length);
    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  };

  return {
    getCategoriesSkeleton,
    getProductsSkeleton,
    getCategoriesCombobox,
    selectCategory,
    expectProductsToBeInTheDocument
  };
};
