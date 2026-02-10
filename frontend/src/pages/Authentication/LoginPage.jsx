import React, { useState, useContext } from 'react';
import './Auth.css';

import { AuthContext } from '../../context/AuthContext.jsx';
import { loginRequest } from '../../api.js';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await loginRequest(email, password);

    if (!response || response.error) {
      alert(response?.error || "Błąd logowania");
      return;
    }

    const { token, user } = response;

    login(token, user);

    // MIGRACJA KOSZYKA
    if (window.migrateCart) {
      await window.migrateCart();
    }

    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Witaj ponownie!</h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Adres Email</label>
            <input 
              type="email" 
              id="email" 
              className="form-input" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Hasło</label>
            <input 
              type="password" 
              id="password" 
              className="form-input" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-btn">Zaloguj się</button>
        </form>

        <p className="auth-switch">
          Nie masz jeszcze konta? 
          <button className="switch-btn" onClick={onSwitchToRegister}>
            Zarejestruj się
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
