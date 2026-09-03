
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPage from '../src/pages/LoginPage/LoginPage';
import { api, clearToken } from '../src/lib/api';
import '@testing-library/jest-dom/vitest';

vi.mock('../src/lib/api', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/api')>(
    '../src/lib/api',
  );

  return { ...actual, api: { post: vi.fn() } };
});

// only the http part is mocked
const mockedPost = vi.mocked(api.post);

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<p>Dashboard page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    clearToken();
    mockedPost.mockReset();
  });

  describe('successful login', () => {
    it('redirects to the dashboard after valid login', async () => {
      mockedPost.mockResolvedValue({
        data: { token: 'valid-token' },
      } as never);

      renderLogin();

      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'cook@example.com' },
      });

      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Login' }));

      expect(await screen.findByText('Dashboard page')).toBeInTheDocument();

      expect(mockedPost).toHaveBeenCalledWith('/users/login', {
        email: 'cook@example.com',
        password: 'password123',
      });
    });
  });

  describe('failed login', () => {
    it('displays an error after invalid login', async () => {
      mockedPost.mockRejectedValue({
        response: { data: { err: 'bad credentials' } },
      });

      renderLogin();

      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'wrong@example.com' },
      });

      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'wrongpass' },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Login' }));

      await waitFor(() =>
        expect(screen.getByRole('alert')).toHaveTextContent(
          'bad credentials',
        ),
      );

      expect(screen.queryByRole('alert')).toHaveTextContent('bad credentials');
    });
  });
});
