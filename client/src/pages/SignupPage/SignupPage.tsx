import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../../lib/api';
import './SignupPage.css';

export default function SignupPage() {
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
      const response = await api.post('/users/signup', {
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
              response?: { data?: { message?: string; err?: string } };
            }).response?.data?.message ??
            (err as {
              response?: { data?: { err?: string } };
            }).response?.data?.err ??
            'Signup failed. Please try again with different credentials.')
          : 'Signup failed. Please try again with different credentials.';

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSubmit({ email, password });
  };

  return (
    <main className="page-shell auth-page signup-page">
      <section className="signup-content">
        <div className="brand" aria-label="Spoonful">
          <svg
            className="brand-mark"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M6 2v8M4 2v4.5M8 2v4.5M4 6.5c0 1.7 1 2.8 2 2.8V22" />
            <path d="M16 2c-1.5 1.8-2.2 4-2.2 6.2 0 2.1 1 3.1 2.2 3.1V22M18 2v20" />
          </svg>
          <span>Spoonful</span>
        </div>

        <h1>Create an Account</h1>

        <form onSubmit={submitForm}>
          <label htmlFor="signup-email">Username</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            value={email}
            placeholder="you@example.com"
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            value={password}
            placeholder="**************"
            autoComplete="new-password"
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error ? (
            <p className="signup-error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="signup-primary-button"
            disabled={submitting}
          >
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>

          <button
            type="button"
            className="signup-cancel-button"
            onClick={() => navigate('/login')}
          >
            Cancel
          </button>
        </form>
      </section>
    </main>
  );
}
