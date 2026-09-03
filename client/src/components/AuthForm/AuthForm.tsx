import { useState } from 'react';
import type { FormEvent } from 'react';
import './AuthForm.css';

type AuthFormProps = {
  mode: 'login' | 'signup';
  onSubmit: (values: { email: string; password: string }) => void;
  error?: string;
  submitting?: boolean;
};

export default function AuthForm({ mode, onSubmit, error, submitting = false }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>{mode === 'login' ? 'Login' : 'Create account'}</h1>

      {error ? <p className="auth-error">{error}</p> : null}

      <label className="field-label" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        className="text-input"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        required
      />

      <label className="field-label" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        className="text-input"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter password"
        required
      />

      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign up'}
      </button>
    </form>
  );
}
