import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setToken } from '../../lib/api';
import './LoginPage.css';
import Logo from '../../assets/Logo.png'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [emailFormatError, setEmailFormatError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async ({
    email: submittedEmail,
    password: submittedPassword,
  }: {
    email: string;
    password: string;
  }) => {
    setAuthError('');
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

      setAuthError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email)) {
      setEmailFormatError('Please enter a valid email address.');
      return;
    }

    setEmailFormatError('');
    void handleSubmit({ email, password });
  };

  const hasEmailError = Boolean(emailFormatError || authError);
  const hasPasswordError = Boolean(authError);

  return (
    <main className="page-shell auth-page login-page">
      <section className="login-content">
        <div className="brand" aria-label="Spoonful">
          <img src={Logo} alt="Spoonful" className="navbar-logo" />
        </div>

        <h1>Welcome Back!</h1>
        <p className="login-subtitle">Log in to your account to continue</p>

        <form onSubmit={submitForm} noValidate>
          <label htmlFor="email" className={hasEmailError ? 'label-error' : ''}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={hasEmailError ? 'input-error' : ''}
            value={email}
            placeholder="Email"
            autoComplete="email"
            onChange={(event) => {
              setEmail(event.target.value);
              if (emailFormatError) setEmailFormatError('');
            }}
            required
          />
          {emailFormatError ? <p className="field-hint">{emailFormatError}</p> : null}
          {!emailFormatError && authError ? (
            <p className="field-hint" role="alert">{authError}</p>
          ) : null}

          <div className="password-label-row">
            <label htmlFor="password" className={hasPasswordError ? 'label-error' : ''}>
              Password
            </label>
          </div>

          <input
            id="password"
            name="password"
            type="password"
            className={hasPasswordError ? 'input-error' : ''}
            value={password}
            placeholder="**************"
            autoComplete="current-password"
            onChange={(event) => {
              setPassword(event.target.value);
              if (authError) setAuthError('');
            }}
            required
          />

          <span className="forgot-password">Forgot Password?</span>

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
