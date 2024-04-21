import { render, screen } from '@testing-library/react';

import TermsAndConditions from '../../src/components/TermsAndConditions';
import userEvent from '@testing-library/user-event';

describe('TermsAndConditions', () => {
  test('should render the correct text and initial state', () => {
    render(<TermsAndConditions />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/terms & conditions/i);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test('should enable the button when the checkbox is checked', async () => {
    const userEvt = userEvent.setup();

    render(<TermsAndConditions />);

    const checkbox = screen.getByRole('checkbox');
    await userEvt.click(checkbox);

    const button = screen.getByRole('button');
    expect(button).toBeEnabled();
  });
});
