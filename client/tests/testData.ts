import type { Recipe } from '../src/lib/recipes';

export const recipe: Recipe = {
  _id: 'recipe-1',
  ownerId: 'user-1',
  title: 'Chickpea Stew',
  image: 'https://example.com/stew.jpg',
  description: 'A warm and hearty stew.',
  tags: ['vegan'],
  ingredients: [{ name: 'Chickpeas', quantity: '2 cans' }],
  instructions: [{ step: 1, description: 'Simmer everything.' }],
  createdAt: '2025-02-13T00:00:00.000Z',
};
