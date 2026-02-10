import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { apiRequest } from './api.js';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Category from './pages/Category.jsx';
import MyCourses from './pages/MyCourses.jsx';
import './styles/app.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        const [cats, crs] = await Promise.all([
          apiRequest('/categories'),
          apiRequest('/courses')
        ]);
        setCategories(cats);
        setCourses(crs);
        setError('');
      } catch (err) {
        setError(err.message || 'Nie udalo sie pobrac danych');
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const loadUser = async () => {
      try {
        const data = await apiRequest('/auth/me', { token });
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem('token');
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCart([]);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const items = await apiRequest('/basket', { token });
        setCart(items);
      } catch (err) {
        console.error(err);
      }
    };

    loadCart();
  }, [user]);

  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.toLowerCase();
    return courses.filter((c) => c.title.toLowerCase().includes(q));
  }, [courses, search]);

  const handleLogin = async ({ name, surname, password }) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { name, surname, password }
    });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    navigate('/');
  };

  const handleRegister = async ({ name, surname, password }) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, surname, password }
    });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCart([]);
    navigate('/');
  };

  const handleAddToCart = async (course) => {
    if (!user) {
      navigate('/logowanie');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) return;

    const items = await apiRequest('/basket', {
      method: 'POST',
      token,
      body: { courseId: course.id }
    });
    setCart(items);
  };

  const handleRemoveFromCart = async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const items = await apiRequest(`/basket/${courseId}`, {
      method: 'DELETE',
      token
    });
    setCart(items);
  };

  return (
    <div className="app-shell">
      <Header
        categories={categories}
        cartCount={cart.length}
        user={user}
        onLogout={handleLogout}
        search={search}
        onSearch={setSearch}
      />

      <main className="app-main">
        {error && (
          <div className="app-error">
            <strong>Blad:</strong> {error}
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <Home
                courses={filteredCourses}
                onAddToCart={handleAddToCart}
                cart={cart}
                loading={loading}
                search={search}
              />
            }
          />
          <Route
            path="/koszyk"
            element={
              <Cart
                cartItems={cart}
                onRemoveFromCart={handleRemoveFromCart}
                onBackToShop={() => navigate('/')}
              />
            }
          />
          <Route
            path="/logowanie"
            element={<Login onLogin={handleLogin} />}
          />
          <Route
            path="/rejestracja"
            element={<Register onRegister={handleRegister} />}
          />
          <Route path="/moje-kursy" element={<MyCourses />} />
          <Route path="/kategorie/:categoryId" element={<Category categories={categories} />} />
          <Route path="/kategorie/:categoryId/:subcategoryId" element={<Category categories={categories} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;