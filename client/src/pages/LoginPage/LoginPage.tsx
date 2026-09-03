import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/AuthForm/AuthForm';
import { api, setToken } from '../../lib/api';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
    setError('');
    setSubmitting(true);

    try {
      const response = await api.post('/users/login', { email, password });
      const token = response.data?.token;

      if (!token) {
        throw new Error('No token returned from server.');
      }

      setToken(token);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Login failed. Please check your credentials and try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell auth-page">
      <AuthForm mode="login" onSubmit={handleSubmit} error={error} submitting={submitting} />

      <p className="auth-switch">
        Need an account? <Link to="/signup">Sign up</Link>
      </p>
    </main>
  );
}
