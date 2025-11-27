import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onSearch, cartCount }) {
  
  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Kursy<span className="logo-highlight">Dev</span>
        </Link>
      </div>

      <div className="navbar-center">
        <div className="search-box">
          <input type="text" placeholder="Czego chcesz się nauczyć?" className="search-input" onChange={handleInputChange} />
          <button className="search-btn">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>
      </div>

      <div className="navbar-right">
        <Link to="/koszyk" className="nav-btn cart-btn" style={{textDecoration: 'none', color: 'inherit'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span className="cart-text">Koszyk</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        
        <div className="auth-buttons">
          <Link to="/logowanie">
            <button className="nav-btn login-btn">Zaloguj się</button>
          </Link>
          
          <Link to="/rejestracja">
            <button className="nav-btn register-btn">Zarejestruj się</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;