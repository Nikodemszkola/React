import React, { useState } from 'react';
import './Auth.css';

function LoginPage({ onSwitchToRegister }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost/kursy/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (err) {
        alert("Serwer nie zwrócił poprawnego JSON!");
        console.error("Otrzymano:", text);
        return;
      }

      if (data.status === "ok") {
        alert("Zalogowano poprawnie!");
      } else {
        alert("Błąd: " + data.message);
      }

    } catch (error) {
      alert("Błąd połączenia z serwerem!");
      console.error(error);
    }
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Hasło</label>
            <input 
              type="password" 
              id="password"
              value={password}
              className="form-input"
              onChange={(e) => setPassword(e.target.value)}
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
