import { render, screen } from '@testing-library/react';

import TermsAndConditions from '../../src/components/TermsAndConditions';
import userEvent from '@testing-library/user-event';

describe('TermsAndConditions', () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);

    return {
      // if below elements are not found in the DOM, test will fail here itself. So no need of toBeInTheDocument assertion below
      heading: screen.getByRole('heading'),
      checkbox: screen.getByRole('checkbox'),
      button: screen.getByRole('button')
    };
  };

  test('should render the correct text and initial state', () => {
    const { heading, checkbox, button } = renderComponent();

    expect(heading).toHaveTextContent(/terms & conditions/i);
    expect(checkbox).not.toBeChecked();
    expect(button).toBeDisabled();
  });

  test('should enable the button when the checkbox is checked', async () => {
    const userEvt = userEvent.setup();
    const { checkbox, button } = renderComponent();

    await userEvt.click(checkbox);
    expect(button).toBeEnabled();
  });
});
