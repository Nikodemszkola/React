import { useState } from 'react';
import './Auth.css';

function Register({ onRegister }) {
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
    <section className="auth">
      <div className="auth-card">
        <h2>Rejestracja</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Imie
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Nazwisko
            <input value={surname} onChange={(e) => setSurname(e.target.value)} required />
          </label>
          <label>
            Haslo
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <div className="auth-error">{error}</div>}
          <button className="solid-btn" type="submit">Utworz konto</button>
        </form>
      </div>
    </section>
  );
}

export default Register;