import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './Header.css';

function Header({ categories, cartCount, user, onLogout, search, onSearch }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    setHovered(null);
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="topbar">
      <div className="brand">
        <Link to="/" className="brand-link">
          Kursy<span>Grid</span>
        </Link>
        <button className="browse-btn" onClick={() => setOpen(!open)}>
          Przegladaj
        </button>
        {open && (
          <div className="browse-panel" ref={ref}>
            {categories.length === 0 ? (
              <div className="browse-empty">Brak kategorii</div>
            ) : (
              <div className="browse-grid">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="browse-col"
                    onMouseEnter={() => setHovered(cat.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <Link to={`/kategorie/${cat.id}`} className="browse-title">
                      {cat.name}
                    </Link>
                    <div className={hovered === cat.id ? 'browse-sub open' : 'browse-sub'}>
                      {cat.subcategories.map((sub) => (
                        <Link key={sub.id} to={`/kategorie/${cat.id}/${sub.id}`}>
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="search">
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Szukaj kursu..."
        />
      </div>

      <div className="actions">
        <Link to="/koszyk" className="cart-link">
          Koszyk <span className="badge">{cartCount}</span>
        </Link>

        {user ? (
          <div className="user-box">
            <div className="user-name">{user.name} {user.surname}</div>
            <button className="ghost-btn" onClick={onLogout}>Wyloguj</button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/logowanie" className="ghost-btn">Zaloguj sie</Link>
            <Link to="/rejestracja" className="solid-btn">Rejestracja</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;