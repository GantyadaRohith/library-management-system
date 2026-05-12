import React, { useState } from 'react';
import api from '../utils/api';

function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/api/auth/register', {
        name, email, password, role
      });
      setSuccess('Registration successful! You can now log in.');
      setName(''); setEmail(''); setPassword(''); setRole('student');
      if (onRegister) onRegister();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="form-title">Register</h2>
        <p className="field-help">Create a student account or request librarian access.</p>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div>
          <label className="field-label" htmlFor="register-name">Name</label>
          <input
            id="register-name"
            className="form-input"
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="register-email">Email</label>
          <input
            id="register-email"
            className="form-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="register-password">Password</label>
          <input
            id="register-password"
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="register-role">Role</label>
          <select
            id="register-role"
            className="form-input"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="librarian">Librarian (Requires Admin Approval)</option>
          </select>
        </div>

        {role === 'librarian' && (
          <div className="alert alert-info">
            📋 <strong>Note:</strong> Librarian accounts require administrator approval.
            You will be able to log in as a student until your request is approved.
          </div>
        )}

        <button className="btn btn-full auth-submit-btn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
