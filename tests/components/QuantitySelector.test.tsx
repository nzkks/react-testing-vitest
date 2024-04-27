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

    const getAddToCartButton = () => screen.queryByRole('button', { name: /add to cart/i });

    const getQuantityControls = () => ({
      quantity: screen.queryByRole('status'),
      decrementButton: screen.queryByRole('button', { name: '-' }),
      incrementButton: screen.queryByRole('button', { name: '+' })
    });

    const userEvt = userEvent.setup();

    const addToCart = async () => await userEvt.click(getAddToCartButton()!);
    const incrementQuantity = async () => await userEvt.click(getQuantityControls().incrementButton!);
    const decrementQuantity = async () => await userEvt.click(getQuantityControls().decrementButton!);

    return {
      getAddToCartButton,
      getQuantityControls,
      addToCart,
      incrementQuantity,
      decrementQuantity
    };
  };

  test('should render the Add to Cart button', () => {
    const { getAddToCartButton } = renderComponent();
    expect(getAddToCartButton()).toBeInTheDocument();
  });

  test('should add the product to the cart', async () => {
    const { getAddToCartButton, addToCart, getQuantityControls } = renderComponent();
    await addToCart();

    const { quantity, decrementButton, incrementButton } = getQuantityControls();
    expect(quantity).toHaveTextContent('1');
    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
    expect(getAddToCartButton()).not.toBeInTheDocument();
  });

  test('should increment the quantity', async () => {
    const { addToCart, getQuantityControls, incrementQuantity } = renderComponent();
    await addToCart();

    const { quantity } = getQuantityControls();
    await incrementQuantity();

    expect(quantity).toHaveTextContent('2');
  });

  test('should decrement the quantity', async () => {
    const { incrementQuantity, decrementQuantity, addToCart, getQuantityControls } = renderComponent();
    await addToCart();

    const { quantity } = getQuantityControls();
    await incrementQuantity();
    await decrementQuantity();

    expect(quantity).toHaveTextContent('1');
  });

  test('should remove the product from the cart', async () => {
    const { decrementQuantity, addToCart, getAddToCartButton, getQuantityControls } = renderComponent();
    await addToCart();

    const { incrementButton, decrementButton, quantity } = getQuantityControls();
    await decrementQuantity();

    expect(quantity).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    expect(getAddToCartButton()).toBeInTheDocument();
  });
});
