import { http, HttpResponse } from 'msw';
import { products } from './data';

export const handlers = [
  http.get('/categories', () => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'Electronics'
      },
      {
        id: 2,
        name: 'Appliances'
      },
      {
        id: 3,
        name: 'Accessories'
      }
    ]);
  }),

  http.get('/products', () => {
    return HttpResponse.json(products);
  }),

  http.get('/products/:id', ({ params }) => {
    const id = parseInt(params.id as string);
    const product = products.find(p => p.id === id);
    if (!product) return new HttpResponse(null, { status: 404 }); // 404 Not Found
    return HttpResponse.json(product);
  })
];
