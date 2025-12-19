import React from 'react';
import './Auth.css';

function RegisterPage({ onSwitchToLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Rejestracja w trakcie implementacji...');
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
            />
          </div>

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