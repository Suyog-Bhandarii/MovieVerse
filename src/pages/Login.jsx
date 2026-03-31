import { useContext, useState } from 'react';
import { AuthContext } from '../context/auth-context';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from
    ? `${location.state.from.pathname}${location.state.from.search || ""}`
    : '/';

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (password.length < 6) {
      setError('Use at least 6 characters for your password.');
      return;
    }

    login(email, password);
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="page-kicker">Welcome back</p>
        <h2>Login</h2>
        <p className="auth-copy">
          Sign in to save movies, manage your watchlist, and continue where you left off.
        </p>
        {location.state?.from ? (
          <p className="auth-hint">Log in first to continue to that page.</p>
        ) : null}
        <label className="form-label" htmlFor="login-email">Email</label>
        <input
          id="login-email"
          className="form-input"
          type="email"
          placeholder="you@example.com"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="form-label" htmlFor="login-password">Password</label>
        <input
          id="login-password"
          className="form-input"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? <p className="form-error">{error}</p> : null}
        <p className="auth-note">Demo mode: your account is stored only in this browser.</p>
        <button className="submit-btn" type="submit">Login</button>
        <p className="auth-switch">
          New to MovieVerse? <Link to="/signup" state={location.state}>Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
