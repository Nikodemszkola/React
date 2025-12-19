import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onSearch, cartCount, categories, user }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation();


  useEffect(() => {
    setIsHovered(false);
    setHoveredCategory(null);
    setDropdownVisible(false); // Zamyka dropdown po zmianie ścieżki
  }, [location.pathname]);

  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible); // Przełącza widoczność menu
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Kursy<span className="logo-highlight">Dev</span>
        </Link>

        <div
          className="nav-btn browse-btn"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Przeglądaj

          {isHovered && (
            <div className="dropdown">
              <ul className="category-list">
                {categories.map((category) => (
                  <Link to={`/categories/${category.name.toLowerCase()}`}>
                    <li
                      key={category.id}
                      onMouseEnter={() => setHoveredCategory(category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >

                        {category.name}


                      {hoveredCategory === category &&
                        category.subcategories.length > 0 && (
                          <div className="subcategory-dropdown">
                            <ul>
                              {category.subcategories.map((subcategory) => (
                                <Link to={`/categories/${category.name.toLowerCase()}/${subcategory.id}`}>
                                  <li key={subcategory.id}>

                                    {subcategory.name}

                                  </li>
                                  </Link>
                              ))}
                            </ul>
                          </div>
                        )}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="navbar-center">
        <div className="search-box">
          <input
            type="text"
            placeholder="Czego chcesz się nauczyć?"
            className="search-input"
            onChange={handleInputChange}
          />
          <Link to="/">
            <button className="search-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </Link>
        </div>
      </div>

      <div className="navbar-right">
        <Link
          to="/koszyk"
          className="nav-btn cart-btn"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span className="cart-text">Koszyk</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {user ? (
          <div className="nav-user">
            <img
              src="/avatar.png"
              alt="User"
              onClick={toggleDropdown} // Obsługuje kliknięcie na avatar
            />
            {dropdownVisible && (
              <div className="user-dropdown">
                <ul>
                  <li><Link to="/moje-kursy">Moje kursy</Link></li>
                  <li><Link to="/platnosci">Płatności</Link></li>
                  <li><Link to="/ustawienia">Ustawienia konta</Link></li>
                  <li><button className="logout-btn" onClick={() => { /* Dodaj logikę wylogowywania */ }}>Wyloguj</button></li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/logowanie">
              <button className="nav-btn login-btn">Zaloguj się</button>
            </Link>
            <Link to="/rejestracja">
              <button className="nav-btn register-btn">Zarejestruj się</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
