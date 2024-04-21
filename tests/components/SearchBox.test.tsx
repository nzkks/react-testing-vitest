import { render, screen } from '@testing-library/react';
import SearchBox from '../../src/components/SearchBox';
import userEvent from '@testing-library/user-event';

describe('SearchBox', () => {
  const renderSearchBox = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    return {
      input: screen.getByPlaceholderText(/search.../i),
      userEvt: userEvent.setup(),
      onChange
    };
  };

  test('should render the search box', () => {
    const { input } = renderSearchBox();
    expect(input).toBeInTheDocument();
  });

  test('should call onChange when the Enter key is pressed', async () => {
    const { input, userEvt, onChange } = renderSearchBox();
    const searchTerm = 'test';
    await userEvt.type(input, searchTerm + '{enter}');
    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  test('should not call onChange when the Enter key is pressed if the input is empty', async () => {
    const { input, userEvt, onChange } = renderSearchBox();
    await userEvt.type(input, '{enter}');
    expect(onChange).not.toHaveBeenCalled();
  });
});
