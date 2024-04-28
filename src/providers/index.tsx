import { PropsWithChildren } from 'react';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

import AuthProvider from './AuthProvider';
import ReactQueryProvider from './ReactQueryProvider';
import { CartProvider } from './CartProvider';
import { LanguageProvider } from './language/LanguageProvider';

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <ReactQueryProvider>
        <CartProvider>
          <LanguageProvider language="en">
            <Theme>{children}</Theme>
          </LanguageProvider>
        </CartProvider>
      </ReactQueryProvider>
    </AuthProvider>
  );
};

export default Providers;
