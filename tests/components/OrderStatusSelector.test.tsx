import { render, screen } from '@testing-library/react';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

import OrderStatusSelector from '../../src/components/OrderStatusSelector';

describe('OrderStatusSelector', () => {
  const renderOrderStatusSelector = () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    return {
      button: screen.getByRole('combobox'),
      userEvt: userEvent.setup()
    };
  };

  test('should render New as the default value', () => {
    const { button } = renderOrderStatusSelector();
    expect(button).toHaveTextContent(/new/i);
  });

  test('should render the correct options', async () => {
    const { button, userEvt } = renderOrderStatusSelector();
    await userEvt.click(button);

    const options = await screen.findAllByRole('option');
    expect(options.length).toBe(3);

    const labels = options.map(option => option.textContent);
    expect(labels).toEqual(['New', 'Processed', 'Fulfilled']);
  });
});
