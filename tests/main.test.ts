import { test, expect, describe } from 'vitest';

describe('group', () => {
  test('should', async () => {
    const response = await fetch('/categories');
    const data = await response.json();
    console.log(data);

    expect(data).toHaveLength(3);
  });
});
