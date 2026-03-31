import { useContext, useState } from 'react';
import { AuthContext } from '../context/auth-context';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

const Signup = () => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    login(email, password);
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="page-kicker">Create your account</p>
        <h2>Sign Up</h2>
        <p className="auth-copy">
          Start building a personal watchlist and keep your movie picks in one place.
        </p>
        <label className="form-label" htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          className="form-input"
          type="email"
          placeholder="you@example.com"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="form-label" htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          className="form-input"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="form-label" htmlFor="signup-confirm">Confirm password</label>
        <input
          id="signup-confirm"
          className="form-input"
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          autoComplete="new-password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error ? <p className="form-error">{error}</p> : null}
        <p className="auth-note">Demo mode: your account is stored only in this browser.</p>
        <button className="submit-btn" type="submit">Create account</button>
        <p className="auth-switch">
          Already have an account? <Link to="/login" state={location.state}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
