import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DashboardPage from '../src/pages/DashboardPage/DashboardPage';
import NewRecipePage from '../src/pages/NewRecipePage/NewRecipePage';
import { api } from '../src/lib/api';
import '@testing-library/jest-dom/vitest';
import { recipe } from './testData';

vi.mock('../src/lib/api', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/api')>('../src/lib/api');
  return { ...actual, api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() }, getUserId: vi.fn(() => 'user-1') };
});

const mockedApi = vi.mocked(api);

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={['/account']}>
      <Routes>
        <Route path="/account" element={<DashboardPage />} />
        <Route path="/dashboard/:id/edit" element={<p>Edit page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

function fillRecipeForm() {
  fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Stew' } });
  fireEvent.change(screen.getByLabelText('Image URL'), { target: { value: 'https://example.com/new.jpg' } });
  fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'A new recipe.' } });
  fireEvent.change(screen.getByPlaceholderText('Ingredient name'), { target: { value: 'Beans' } });
  fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '1 cup' } });
  fireEvent.change(screen.getByPlaceholderText('Describe this step'), { target: { value: 'Cook the beans.' } });
}



describe('recipe CRUD components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedApi.get.mockReset();
    mockedApi.post.mockReset();
    mockedApi.put.mockReset();
    mockedApi.delete.mockReset();
    window.confirm = vi.fn(() => true);
  });

  it('adds a recipe and shows success feedback', async () => {
    mockedApi.post.mockResolvedValue({ data: recipe } as never);
    render(
      <MemoryRouter initialEntries={['/dashboard/new']}>
        <NewRecipePage />
      </MemoryRouter>,
    );

    fillRecipeForm();
    fireEvent.click(screen.getByRole('button', { name: 'Create recipe' }));

    await waitFor(() => expect(mockedApi.post).toHaveBeenCalledWith('/recipes', expect.objectContaining({ title: 'New Stew' })));
    expect(await screen.findByRole('status')).toHaveTextContent('Recipe created successfully.');
  });

  it('removes a recipe from the dashboard after deletion', async () => {
  mockedApi.get.mockResolvedValue({ data: [recipe] } as never);
  mockedApi.delete.mockResolvedValue({ data: { message: 'Deleted Recipe' } } as never);
  renderDashboard();

  expect(await screen.findByText('Chickpea Stew')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Yes, Delete Recipe' }));

  await waitFor(() => expect(screen.queryByText('Chickpea Stew')).not.toBeInTheDocument());
  expect(mockedApi.delete).toHaveBeenCalledWith('/recipes/recipe-1');
});

  it('prefills and updates an existing recipe', async () => {
    mockedApi.get.mockResolvedValue({ data: recipe } as never);
    mockedApi.put.mockResolvedValue({ data: recipe } as never);
    render(
      <MemoryRouter initialEntries={['/dashboard/recipe-1/edit']}>
        <Routes>
          <Route path="/dashboard/:id/edit" element={<NewRecipePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByDisplayValue('Chickpea Stew')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Stew' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => expect(mockedApi.put).toHaveBeenCalledWith('/recipes/recipe-1', expect.objectContaining({ title: 'Updated Stew' })));
    expect(await screen.findByRole('status')).toHaveTextContent('Recipe updated successfully.');
  });
});