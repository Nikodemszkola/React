import React from 'react';
import './Auth.css';

function RegisterPage({ onSwitchToLogin }) {

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const nickname = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const res = await fetch("http://localhost/kursy/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, email, password })
      });
  
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        alert("Serwer nie zwrócił poprawnego JSON!");
        console.error(text);
        return;
      }
  
      if (data.status === "ok") {
        alert(data.message);
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
