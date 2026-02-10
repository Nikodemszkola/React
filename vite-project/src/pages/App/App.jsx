import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import CourseCard from './components/CourseCard.jsx';
import CartPage from '../Cart/CartPage.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import LoginPage from '../Authentication/LoginPage.jsx';
import RegisterPage from '../Authentication/RegisterPage.jsx';
import MyCoursesPage from '../MyCourses/MyCoursesPage.jsx';
import { apiRequest } from '../../api.js';

function App() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const [cats, crs] = await Promise.all([
          apiRequest('/categories'),
          apiRequest('/courses')
        ]);
        setCategories(cats);
        setCourses(crs);
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const loadUser = async () => {
      try {
        const data = await apiRequest('/auth/me', { token });
        setUser(data.user);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadBasket = async () => {
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

    loadBasket();
  }, [user]);

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

    try {
      const items = await apiRequest('/basket', {
        method: 'POST',
        token,
        body: { courseId: course.id }
      });
      setCart(items);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFromCart = async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const items = await apiRequest(`/basket/${courseId}`, {
        method: 'DELETE',
        token
      });
      setCart(items);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='app-main'>
      <Navbar
        onSearch={setSearchTerm}
        cartCount={cart.length}
        categories={categories}
        user={user}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={
          <div className='app-container'>
            <header>
              <h1 className='main-title'>Dostepne Kursy</h1>
            </header>

            <div className='filters'>
              Filtry:
            </div>

            <main className='courses-grid'>
              {filteredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  description={course.description}
                  image={course.image}
                  price={course.price}
                  category={course.category}
                  subcategories={course.subcategories}
                  isInCart={cart.some(item => item.id === course.id)}
                  onAddToCart={() => handleAddToCart(course)}
                />
              ))}
            </main>
          </div>
        } />

        <Route path="/koszyk" element={
          <CartPage
            cartItems={cart}
            onRemoveFromCart={handleRemoveFromCart}
            onBackToShop={() => navigate('/')}
          />
        } />

        <Route path="/logowanie" element={
          <LoginPage
            onSwitchToRegister={() => navigate('/rejestracja')}
            onLogin={handleLogin}
          />
        } />

        <Route path="/rejestracja" element={
          <RegisterPage
            onSwitchToLogin={() => navigate('/logowanie')}
            onRegister={handleRegister}
          />
        } />

        <Route path="/moje-kursy" element={<MyCoursesPage />} />

        <Route path="/categories/:categoryName" element={
          <div className="category-page">
            <h2>Kategoria</h2>
          </div>
        } />

        <Route path="/categories/:categoryName/:subcategoryName" element={
          <div className="subcategory-page">
            <h2>Podkategoria</h2>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;