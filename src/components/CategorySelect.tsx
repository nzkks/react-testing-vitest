import { useQuery } from 'react-query';
import Skeleton from 'react-loading-skeleton';
import { Select } from '@radix-ui/themes';
import axios from 'axios';

import { Category } from '../entities';

const CategorySelect = ({ onChange }: { onChange: (categoryId: number) => void }) => {
  const {
    isLoading,
    error,
    data: categories
  } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: () => axios.get<Category[]>('/categories').then(res => res.data)
  });

  if (isLoading) {
    return (
      <div role="progressbar" aria-label="Loading categories">
        <Skeleton />
      </div>
    );
  }

  if (error) return null;

  return (
    <Select.Root onValueChange={categoryId => onChange(parseInt(categoryId))}>
      <Select.Trigger placeholder="Filter by Category" />
      <Select.Content>
        <Select.Group>
          <Select.Label>Category</Select.Label>
          <Select.Item value="all">All</Select.Item>
          {categories?.map(category => (
            <Select.Item key={category.id} value={category.id.toString()}>
              {category.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default CategorySelect;
