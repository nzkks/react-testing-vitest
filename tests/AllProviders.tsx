import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Theme } from '@radix-ui/themes';
import { CartProvider } from '../src/providers/CartProvider';

const AllProviders = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Theme>{children}</Theme>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default AllProviders;
