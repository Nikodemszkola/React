import React, { useState, useContext } from 'react';
import './Auth.css';

import { registerRequest } from '../../api.js';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function RegisterPage({ onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await registerRequest(name, email, password);

    if (!response || response.error) {
      alert(response?.error || "Błąd rejestracji");
      return;
    }

    const { token, user } = response;

    login(token, user);

    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Utwórz konto</h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Imię</label>
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

          <button type="submit" className="auth-btn">Zarejestruj się</button>
        </form>

        <p className="auth-switch">
          Masz już konto? 
          <button className="switch-btn" onClick={onSwitchToLogin}>
            Zaloguj się
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
