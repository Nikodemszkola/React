import React, { useState } from 'react';
import './Auth.css';

function RegisterPage({ onSwitchToLogin, onRegister }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onRegister({ name, surname, password });
    } catch (err) {
      setError(err.message || 'Blad rejestracji');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Utworz konto</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Imie</label>
            <input
              type="text"
              id="name"
              className="form-input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="surname">Nazwisko</label>
            <input
              type="text"
              id="surname"
              className="form-input"
              required
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Haslo</label>
            <input
              type="password"
              id="password"
              className="form-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn">Zarejestruj sie</button>
        </form>

        <p className="auth-switch">
          Masz juz konto?
          <button className="switch-btn" onClick={onSwitchToLogin}>
            Zaloguj sie
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;