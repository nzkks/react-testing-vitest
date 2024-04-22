import { http, HttpResponse } from 'msw';

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
    return HttpResponse.json([
      {
        id: 1,
        name: 'Product 1'
      },
      {
        id: 2,
        name: 'Product 2'
      }
    ]);
  })
];
