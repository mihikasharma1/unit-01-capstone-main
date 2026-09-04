import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../../lib/api';
import './SignupPage.css';
import Logo from '../../assets/Logo.png'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
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

    const nextEmailError = EMAIL_PATTERN.test(email)
      ? ''
      : 'Please use a valid email address as your username.';
    const nextPasswordError =
      password.length >= MIN_PASSWORD_LENGTH
        ? ''
        : 'Please add a password with at least 8 characters.';

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      return;
    }

    void handleSubmit({ email, password });
  };

  return (
    <main className="page-shell auth-page signup-page">
      <section className="signup-content">
        <div className="brand" aria-label="Spoonful">
          <img src={Logo} alt="Spoonful" className="navbar-logo" />
        </div>

        <h1>Create an Account</h1>

        <form onSubmit={submitForm}>
          <label
            htmlFor="signup-email"
            className={emailError ? 'label-error' : ''}
          >
            Username
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            className={emailError ? 'input-error' : ''}
            value={email}
            placeholder="you@example.com"
            autoComplete="email"
            onChange={(event) => {
              setEmail(event.target.value);
              if (emailError) setEmailError('');
            }}
            required
          />
          {emailError ? <p className="field-hint">{emailError}</p> : null}

          <label
            htmlFor="signup-password"
            className={passwordError ? 'label-error' : ''}
          >
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            className={passwordError ? 'input-error' : ''}
            value={password}
            placeholder="**************"
            autoComplete="new-password"
            onChange={(event) => {
              setPassword(event.target.value);
              if (passwordError) setPasswordError('');
            }}
            required
          />
          {passwordError ? <p className="field-hint">{passwordError}</p> : null}

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
