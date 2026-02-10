import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

import CourseCard from './components/CourseCard.jsx';
import CartPage from '../Cart/CartPage.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import LoginPage from '../Authentication/LoginPage.jsx';
import RegisterPage from '../Authentication/RegisterPage.jsx';
import MyCoursesPage from '../MyCourses/MyCoursesPage.jsx';
import SuccessPage from '../Success/SuccessPage.jsx';

import ProtectedRoute from '../../ProtectedRoute.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';

function App() {

  // -------------------------------
  //       AUTH
  // -------------------------------
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  // -------------------------------
  //       DANE Z BACKENDU
  // -------------------------------
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [basket, setBasket] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const USER_ID = 1; // testowo

  // Pobieranie kursów, kategorii i koszyka
  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:4000/courses"),
          fetch("http://localhost:4000/categories"),
        ]);

        if (!coursesRes.ok || !categoriesRes.ok) {
          throw new Error("Błąd pobierania danych z backendu");
        }

        setCourses(await coursesRes.json());
        setCategories(await categoriesRes.json());

        // jeśli zalogowany → pobierz koszyk z backendu
        if (isLoggedIn) {
          const basketRes = await fetch(`http://localhost:4000/basket/${USER_ID}`);
          const basketData = await basketRes.json();
          setBasket(basketData.map(item => ({ ...item, price: Number(item.price) })));
        } else {
          // jeśli niezalogowany → koszyk z localStorage
          const local = JSON.parse(localStorage.getItem("cart") || "[]");
          setBasket(local.map(item => ({ ...item, price: Number(item.price) })));
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isLoggedIn]);

  // -------------------------------
  //         OBSŁUGA KOSZYKA
  // -------------------------------

  const refreshBasket = async () => {
    if (isLoggedIn) {
      const res = await fetch(`http://localhost:4000/basket/${USER_ID}`);
      const data = await res.json();
      setBasket(data.map(item => ({ ...item, price: Number(item.price) })));
    } else {
      const local = JSON.parse(localStorage.getItem("cart") || "[]");
      setBasket(local.map(item => ({ ...item, price: Number(item.price) })));
    }
  };

  const handleAddToCart = async (course) => {
    if (!isLoggedIn) {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

      if (!localCart.some(item => item.id === course.id)) {
        const updated = [...localCart, course];
        localStorage.setItem("cart", JSON.stringify(updated));
      }

      refreshBasket();
      return;
    }

    await fetch(`http://localhost:4000/basket/${USER_ID}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id })
    });

    refreshBasket();
  };

  const handleRemoveFromCart = async (courseId) => {
    if (!isLoggedIn) {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updated = localCart.filter(item => item.id !== courseId);
      localStorage.setItem("cart", JSON.stringify(updated));
      refreshBasket();
      return;
    }

    await fetch(`http://localhost:4000/basket/${USER_ID}/remove/${courseId}`, {
      method: "DELETE"
    });

    refreshBasket();
  };

  // -------------------------------
  //   MIGRACJA LOCAL → BACKEND
  // -------------------------------
  const migrateLocalCartToBackend = async () => {
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (localCart.length === 0) return;

    for (const course of localCart) {
      await fetch(`http://localhost:4000/basket/${USER_ID}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id })
      });
    }

    localStorage.removeItem("cart");
    await refreshBasket();
  };

  window.migrateCart = migrateLocalCartToBackend;

  // -------------------------------
  //         WYSZUKIWANIE
  // -------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate();

  // -------------------------------
  //         RENDER
  // -------------------------------

  if (loading) {
    return <div className="loading-screen">Ładowanie danych...</div>;
  }

  if (error) {
    return <div className="error-screen">Błąd: {error}</div>;
  }

  return (
    <div className='app-main'>

      <Navbar
        onSearch={setSearchTerm}
        cartCount={basket.length}
        categories={categories}
      />

      <Routes>

        <Route path="/" element={
          <div className='app-container'>
            <header>
              <h1 className='main-title'>Dostępne Kursy</h1>
            </header>

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
                  isInCart={basket.some(item => item.id === course.id)}
                  onAddToCart={() => handleAddToCart(course)}
                />
              ))}
            </main>
          </div>
        } />

        <Route path="/koszyk" element={
          <CartPage
            cartItems={basket}
            onRemoveFromCart={handleRemoveFromCart}
            onBackToShop={() => navigate('/')}
            isLoggedIn={isLoggedIn}
          />
        } />

        <Route path="/logowanie" element={<LoginPage />} />
        <Route path="/rejestracja" element={<RegisterPage />} />

        <Route
          path="/moje-kursy"
          element={
            <ProtectedRoute>
              <MyCoursesPage />
            </ProtectedRoute>
          }
        />

        <Route path="/success" element={<SuccessPage />} />

      </Routes>

    </div>
  );
}

export default App;
