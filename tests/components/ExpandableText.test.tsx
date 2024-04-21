import { render, screen } from '@testing-library/react';
import ExpandableText from '../../src/components/ExpandableText';
import userEvent from '@testing-library/user-event';

describe('ExpandableText', () => {
  const limit = 255;
  const longText = 'a'.repeat(limit + 1);
  const truncatedText = longText.substring(0, limit);

  test('should render the full text if less than the 255 characters', () => {
    const text = 'Hello World';
    render(<ExpandableText text={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('should truncate the text if longer than the 255 characters', () => {
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent(/more/i);
  });

  test('should expand text when show more button is clicked', async () => {
    const userEvt = userEvent.setup();
    render(<ExpandableText text={longText} />);

    const showMoreButton = screen.getByRole('button', { name: /more/i });
    await userEvt.click(showMoreButton);

    expect(screen.getByText(longText)).toBeInTheDocument();
    const showLessButton = screen.getByRole('button', { name: /less/i });
    expect(showLessButton).toBeInTheDocument();
  });

  test('should collapse text when show less button is clicked', async () => {
    const userEvt = userEvent.setup();
    render(<ExpandableText text={longText} />);

    const showMoreButton = screen.getByRole('button', { name: /more/i });
    await userEvt.click(showMoreButton);

    const showLessButton = screen.getByRole('button', { name: /less/i });
    await userEvt.click(showLessButton);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(showMoreButton).toBeInTheDocument();
  });
});
