import React from 'react';
import './Auth.css';

function LoginPage({ onSwitchToRegister }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Logowanie w trakcie implementacji...');
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Hasło</label>
            <input 
              type="password" 
              id="password" 
              className="form-input" 
              required
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