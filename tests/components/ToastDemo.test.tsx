import { render, screen } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import userEvt from '@testing-library/user-event';

import ToastDemo from '../../src/components/ToastDemo';

describe('ToastDemo', () => {
  test('should render a toast', async () => {
    userEvt.setup();

    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    const button = screen.getByRole('button');
    await userEvt.click(button);

    const toast = await screen.findByText(/success/i);
    expect(toast).toBeInTheDocument();
  });
});
