import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import DashboardPage from '../src/pages/DashboardPage/DashboardPage';
import BrowseRecipesPage from '../src/pages/BrowseRecipesPage/BrowseRecipesPage';

vi.mock('../src/lib/api', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/api')>('../src/lib/api');
  return {
    ...actual,
    api: { get: vi.fn().mockResolvedValue({ data: [] }) },
    getUserId: vi.fn(() => 'user-1'),
  };
});

describe('Browse Recipes navigation', () => {
  it('displays the browse recipes page when Browse Recipes is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/recipes" element={<BrowseRecipesPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByText('Your Recipes');
    screen.getByRole('link', { name: 'Browse Recipes' }).click();

    expect(await screen.findByRole('heading', { name: 'Recipe List' })).toBeInTheDocument();
  });
});