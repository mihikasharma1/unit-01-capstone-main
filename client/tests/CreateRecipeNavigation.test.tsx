import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import DashboardPage from '../src/pages/DashboardPage/DashboardPage';
import NewRecipePage from '../src/pages/NewRecipePage/NewRecipePage';

vi.mock('../src/lib/api', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/api')>('../src/lib/api');
  return {
    ...actual,
    api: { get: vi.fn().mockResolvedValue({ data: [] }) },
    getUserId: vi.fn(() => 'user-1'),
  };
});

describe('Create Recipe navigation', () => {
  it('displays the create recipe form when Create Recipe is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/new" element={<NewRecipePage />} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByText('Your Recipes');
    screen.getByRole('link', { name: 'Create Recipe' }).click();

    expect(await screen.findByRole('heading', { name: 'Create recipe' })).toBeInTheDocument();
  });
});
