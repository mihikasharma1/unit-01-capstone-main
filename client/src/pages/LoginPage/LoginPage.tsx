import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setToken } from '../../lib/api';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async ({
    email: submittedEmail,
    password: submittedPassword,
  }: {
    email: string;
    password: string;
  }) => {
    setError('');
    setSubmitting(true);

    try {
      const response = await api.post('/users/login', {
        email: submittedEmail,
        password: submittedPassword,
      });

      const token = response.data?.token;

      if (!token) {
        throw new Error('No token returned from server.');
      }

      setToken(token);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? ((err as {
              response?: { data?: { err?: string; message?: string } };
            }).response?.data?.message ??
            (err as {
              response?: { data?: { err?: string } };
            }).response?.data?.err ??
            'Login failed. Please check your credentials and try again.')
          : 'Login failed. Please check your credentials and try again.';

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSubmit({ email, password });
  };

  return (
    <main className="page-shell auth-page login-page">
      <section className="login-content">
        <div className="brand" aria-label="Spoonful">
          <span className="brand-mark" aria-hidden="true">
            ♜
          </span>
          <span>Spoonful</span>
        </div>

        <h1>Welcome Back!</h1>
        <p className="login-subtitle">Log in to your account to continue</p>

        <form onSubmit={submitForm} noValidate>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            placeholder="Email"
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <div className="password-label-row">
            <label htmlFor="password">Password</label>
          </div>

          <input
            id="password"
            name="password"
            type="password"
            value={password}
            placeholder="**************"
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <span className="forgot-password">Forgot Password?</span>

          {error ? (
            <p className="login-error" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login'}
          </button>

          <Link to="/signup" className="create-account-button">
            Create an Account
          </Link>

          <Link to="/recipes" className="explore-link">
            Explore Recipes without Logging In
          </Link>
        </form>

        
      </section>
    </main>
  );
}
