import { render, screen } from '@testing-library/react';
import UserAccount from '../../src/components/UserAccount';
import { User } from '../../src/entities';

const userDetails: User = {
  id: 1,
  name: 'NZKKS'
};

describe('UserAccount', () => {
  test('should render the user name in the DOM', () => {
    render(<UserAccount user={userDetails} />);

    const userName = screen.getByText(/nzkks/i);
    expect(userName).toBeInTheDocument();
  });

  test('should not render the edit button in the DOM when the user is not an admin', () => {
    render(<UserAccount user={userDetails} />);

    const editButton = screen.queryByRole('button');
    expect(editButton).not.toBeInTheDocument();
  });

  test('should render the edit button in the DOM when the user is an admin', () => {
    render(<UserAccount user={{ ...userDetails, isAdmin: true }} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    expect(editButton).toBeInTheDocument();
  });
});
