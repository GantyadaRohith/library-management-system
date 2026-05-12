import React, { useState } from 'react';
import api from '../utils/api';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/login', { email, password });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      setError(''); // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="form-title">Sign In</h2>
        <p className="field-help">Use your account email and password to continue.</p>
        {error && <div className="alert alert-error">{error}</div>}

        <div>
          <label className="field-label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            className="form-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-full auth-submit-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
