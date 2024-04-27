import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import QuantitySelector from '../../src/components/QuantitySelector';
import { Product } from '../../src/entities';
import { CartProvider } from '../../src/providers/CartProvider';

describe('QuantitySelector', () => {
  const renderComponent = () => {
    const product: Product = { id: 1, name: 'Product 1', price: 9.99, categoryId: 1 };

    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    return {
      getAddToCartButton: () => screen.queryByRole('button', { name: /add to cart/i }),
      getQuantityControls: () => ({
        quantity: screen.queryByRole('status'),
        decrementButton: screen.queryByRole('button', { name: '-' }),
        incrementButton: screen.queryByRole('button', { name: '+' })
      }),
      userEvt: userEvent.setup()
    };
  };

  test('should render the Add to Cart button', () => {
    const { getAddToCartButton } = renderComponent();
    expect(getAddToCartButton()).toBeInTheDocument();
  });

  test('should add the product to the cart', async () => {
    const { userEvt, getAddToCartButton, getQuantityControls } = renderComponent();
    await userEvt.click(getAddToCartButton()!);

    const { quantity, decrementButton, incrementButton } = getQuantityControls();
    expect(quantity).toHaveTextContent('1');
    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
    expect(getAddToCartButton()).not.toBeInTheDocument();
  });

  test('should increment the quantity', async () => {
    const { getAddToCartButton, userEvt, getQuantityControls } = renderComponent();
    await userEvt.click(getAddToCartButton()!);

    const { incrementButton, quantity } = getQuantityControls();
    await userEvt.click(incrementButton!);

    expect(quantity).toHaveTextContent('2');
  });

  test('should decrement the quantity', async () => {
    const { getAddToCartButton, userEvt, getQuantityControls } = renderComponent();
    await userEvt.click(getAddToCartButton()!);

    const { incrementButton, decrementButton, quantity } = getQuantityControls();
    await userEvt.click(incrementButton!);
    await userEvt.click(decrementButton!);

    expect(quantity).toHaveTextContent('1');
  });

  test('should remove the product from the cart', async () => {
    const { userEvt, getAddToCartButton, getQuantityControls } = renderComponent();
    await userEvt.click(getAddToCartButton()!);

    const { incrementButton, decrementButton, quantity } = getQuantityControls();
    await userEvt.click(decrementButton!);

    expect(quantity).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(getAddToCartButton()).toBeInTheDocument();
  });
});
