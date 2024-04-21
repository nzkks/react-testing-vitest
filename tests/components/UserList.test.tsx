import { render, screen } from '@testing-library/react';
import UserList from '../../src/components/UserList';
import { User } from '../../src/entities';

describe('UserList', () => {
  test('should render no users when users array is empty', () => {
    render(<UserList users={[]} />);

    expect(screen.getByText(/no users/i)).toBeInTheDocument();
  });

  test('should render a list of users', () => {
    const users: User[] = [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' }
    ];

    render(<UserList users={users} />);

    users.forEach(user => {
      const link = screen.getByRole('link', { name: user.name });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/users/${user.id}`);
    });
  });
});
