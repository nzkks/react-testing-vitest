import { render, screen } from '@testing-library/react';
import TagList from '../../src/components/TagList';

describe('TagList', () => {
  test('should render the tags', async () => {
    render(<TagList />);
    const listItems = await screen.findAllByRole('listitem');
    expect(listItems.length).toBeGreaterThan(0);
  });
});
