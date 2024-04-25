import { Table } from '@radix-ui/themes';
import axios from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import QuantitySelector from '../components/QuantitySelector';
import { Product } from '../entities';
import CategorySelect from '../components/CategorySelect';

function BrowseProducts() {
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: () => axios.get<Product[]>('/products').then(res => res.data)
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();

  if (productsQuery.error) return <div>Error: {productsQuery.error.message}</div>;

  const renderProducts = () => {
    const skeletons = [1, 2, 3, 4, 5];
    const { isLoading, error, data: products } = productsQuery;
    if (error) return <div>Error: {error.message}</div>;

    const visibleProducts = selectedCategoryId ? products!.filter(p => p.categoryId === selectedCategoryId) : products;

    return (
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body
          role={isLoading ? 'progressbar' : undefined}
          aria-label={isLoading ? 'Loading products' : undefined}
        >
          {isLoading &&
            skeletons.map(skeleton => (
              <Table.Row key={skeleton}>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
              </Table.Row>
            ))}
          {!isLoading &&
            visibleProducts!.map(product => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>${product.price}</Table.Cell>
                <Table.Cell>
                  <QuantitySelector product={product} />
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    );
  };

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">
        <CategorySelect onChange={categoryId => setSelectedCategoryId(categoryId)} />
      </div>
      {renderProducts()}
    </div>
  );
}

export default BrowseProducts;
