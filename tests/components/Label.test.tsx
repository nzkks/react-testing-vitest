import { render, screen } from '@testing-library/react';

import Label from '../../src/components/Label';
import { Language } from '../../src/providers/language/type';
import { LanguageProvider } from '../../src/providers/language/LanguageProvider';

describe('Label', () => {
  const renderComponent = (labelId: string, language: Language) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    );
  };

  describe('should render the label', () => {
    test.each([
      { labelId: 'welcome', text: 'Welcome' },
      { labelId: 'new_product', text: 'New Product' },
      { labelId: 'edit_product', text: 'Edit Product' }
    ])('should render $text for $labelId', ({ labelId, text }) => {
      renderComponent(labelId, 'en');

      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  describe('Given the current language is ES', () => {
    test.each([
      { labelId: 'welcome', text: 'Bienvenidos' },
      { labelId: 'new_product', text: 'Nuevo Producto' },
      { labelId: 'edit_product', text: 'Editar Producto' }
    ])('should render $text for $labelId', ({ labelId, text }) => {
      renderComponent(labelId, 'es');

      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test('should throw an error if given an invalid labelId', () => {
    expect(() => renderComponent('!', 'en')).toThrowError();
  });
});
