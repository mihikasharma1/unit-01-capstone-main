import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import DashboardPage from '../src/pages/DashboardPage/DashboardPage';
import NewRecipePage from '../src/pages/NewRecipePage/NewRecipePage';

vi.mock('../src/lib/api', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/api')>('../src/lib/api');
  const editRecipe = {
    _id: 'recipe-1',
    ownerId: 'user-1',
    title: 'Chicken tikka Stew',
    image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2023/04/butter-chicken-recipe.jpg',
    description: 'A warm and hearty stew.',
    tags: ['vegan'],
    ingredients: [{ name: 'Chickpeas', quantity: '2 cans' }],
    instructions: [{ step: 1, description: 'Simmer everything.' }],
  };

  return {
    ...actual,
    api: {
      get: vi.fn((path: string) => Promise.resolve({
        data: path === '/recipes' ? [editRecipe] : editRecipe,
      })),
    },
    getUserId: vi.fn(() => 'user-1'),
  };
});

describe('Edit Recipe navigation', () => {
  it('displays the edit form when Edit is clicked on a recipe', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/:id/edit" element={<NewRecipePage />} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByText('Chicken tikka Stew');
    screen.getByRole('button', { name: 'Edit' }).click();

    expect(await screen.findByRole('heading', { name: 'Edit recipe' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Chicken tikka Stew')).toBeInTheDocument();
  });
});