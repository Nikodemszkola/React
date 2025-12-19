import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import CourseCard from './components/CourseCard.jsx';
import CartPage from '../Cart/CartPage.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import LoginPage from '../Authentication/LoginPage.jsx';
import RegisterPage from '../Authentication/RegisterPage.jsx';

function App() {

  const categories = [
    {
      id: "programming",
      name: "Programming",
      subcategories: [
        { id: "backend", name: "Backend" },
        { id: "frontend", name: "Frontend" },
        { id: "fullstack", name: "Fullstack" }
      ]
    },
    {
      id: "data-science",
      name: "Data Science",
      subcategories: [
        { id: "python", name: "Python" },
        { id: "analytics", name: "Analytics" },
        { id: "machine-learning", name: "Machine Learning" }
      ]
    },
    {
      id: "design",
      name: "Design",
      subcategories: [
        { id: "uiux", name: "UI/UX" },
        { id: "figma", name: "Figma" },
        { id: "graphic", name: "Graphic Design" }
      ]
    },
    {
      id: "business",
      name: "Business",
      subcategories: [
        { id: "marketing", name: "Marketing" },
        { id: "sales", name: "Sales" },
        { id: "entrepreneurship", name: "Entrepreneurship" }
      ]
    }
  ];


  const courses = [
    {
      id: 1,
      title: "Java Spring Framework & Spring Boot",
      description: "Master Java, Spring Boot, Microservices, Docker.",
      image: "https://img-c.udemycdn.com/course/240x135/2167814_a0e6_5.jpg",
      price: 39.99,
      category: "programming",
      subcategories: ["backend"]
    },
    {
      id: 2,
      title: "React od Podstaw do Eksperta",
      description: "React, Hooks, Redux, Next.js oraz projekty.",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      price: 49.99,
      category: "programming",
      subcategories: ["frontend"]
    },
    {
      id: 3,
      title: "Python dla Analizy Danych",
      description: "Pandas, NumPy, Matplotlib, analiza danych.",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
      price: 29.99,
      category: "data-science",
      subcategories: ["python", "analytics"]
    },
    {
      id: 4,
      title: "Java Spring Boot – Advanced",
      description: "Zaawansowane API, Security, CI/CD, Cloud.",
      image: "https://img-c.udemycdn.com/course/240x135/2167814_a0e6_5.jpg",
      price: 54.99,
      category: "programming",
      subcategories: ["backend"]
    },
    {
      id: 5,
      title: "React – Kompletny Kurs",
      description: "Poznaj React, Redux Toolkit i TypeScript.",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      price: 44.99,
      category: "programming",
      subcategories: ["frontend"]
    },
    {
      id: 6,
      title: "Python – Data Science Bootcamp",
      description: "Machine Learning, Pandas, scikit-learn.",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
      price: 59.99,
      category: "data-science",
      subcategories: ["python", "machine-learning"]
    },
    {
      id: 10,
      title: "UI/UX Design Masterclass",
      description: "Projektowanie w Figma, typografia, kolory.",
      image: "https://s3-alpha.figma.com/hub/file/1481185752/fc90e7a2-f87c-41c3-9d41-3b7630737a23-cover.png",
      price: 59.99,
      category: "design",
      subcategories: ["uiux", "figma"]
    }
  ];

  //const user = null;
  const user = [{id:1, name:"Gosc"}]; //do testu
  //pozniej zaimplementowac JWT do odbierania informacji o stanie zalogowania

  // -------------------------------
  //         OBSŁUGA LOCALSTORAGE
  // -------------------------------
  const CART_KEY = "cart";

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (course) => {
    if (!cart.some(item => item.id === course.id)) {
      setCart(prev => [...prev, course]);
    }
  };

  const handleRemoveFromCart = (courseId) => {
    setCart(prev => prev.filter(item => item.id !== courseId));
  };


  // --- Wyszukiwanie ---
  const [searchTerm, setSearchTerm] = useState('');
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const navigate = useNavigate();

  return (
    <div className='app-main'>

      <Navbar
        onSearch={setSearchTerm}
        cartCount={cart.length}
        categories={categories}
        user = {user}
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
          <LoginPage onSwitchToRegister={() => navigate('/rejestracja')} />
        } />

        <Route path="/rejestracja" element={
          <RegisterPage onSwitchToLogin={() => navigate('/logowanie')} />
        } />

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
