import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import CourseCard from './CourseCard';
import CartPage from './CartPage';
import Navbar from './Navbar';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage.jsx';

function App() {
  // Przykładowe dane kursów (normalnie pobierałbyś je z API)
  const courses = [
    {
      id: 1,
      title: 'Java Spring Framework & Spring Boot',
      description: 'Master Java, Spring, Spring Boot, Docker and Microservices. Ideal for beginners and intermediate developers.',
      image: 'https://img-c.udemycdn.com/course/240x135/2167814_a0e6_5.jpg',
      price: 39.99,
      category: 'Backend'
    },
    {
      id: 2,
      title: 'React od Podstaw do Eksperta',
      description: 'Kompletny przewodnik po React, Hooks, Redux oraz Next.js. Zbuduj 5 realnych projektów.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
      price: 49.99,
      category: 'Frontend'
    },
    {
      id: 3,
      title: 'Python dla Analizy Danych',
      description: 'Naucz się bibliotek Pandas, NumPy, Matplotlib i wejdź w świat Data Science.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg',
      price: 29.99,
      category: 'Data Science'
    },
        {
      id: 4,
      title: 'Java Spring Framework & Spring Boot',
      description: 'Master Java, Spring, Spring Boot, Docker and Microservices. Ideal for beginners and intermediate developers.',
      image: 'https://img-c.udemycdn.com/course/240x135/2167814_a0e6_5.jpg',
      price: 39.99,
      category: 'Backend'
    },
    {
      id: 5,
      title: 'React od Podstaw do Eksperta',
      description: 'Kompletny przewodnik po React, Hooks, Redux oraz Next.js. Zbuduj 5 realnych projektów.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
      price: 49.99,
      category: 'Frontend'
    },
    {
      id: 6,
      title: 'Python dla Analizy Danych',
      description: 'Naucz się bibliotek Pandas, NumPy, Matplotlib i wejdź w świat Data Science.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg',
      price: 29.99,
      category: 'Data Science'
    },
        {
      id: 7,
      title: 'Java Spring Framework & Spring Boot',
      description: 'Master Java, Spring, Spring Boot, Docker and Microservices. Ideal for beginners and intermediate developers.',
      image: 'https://img-c.udemycdn.com/course/240x135/2167814_a0e6_5.jpg',
      price: 39.99,
      category: 'Backend'
    },
    {
      id: 8,
      title: 'React od Podstaw do Eksperta',
      description: 'Kompletny przewodnik po React, Hooks, Redux oraz Next.js. Zbuduj 5 realnych projektów.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
      price: 49.99,
      category: 'Frontend'
    },
    {
      id: 9,
      title: 'Python dla Analizy Danych',
      description: 'Naucz się bibliotek Pandas, NumPy, Matplotlib i wejdź w świat Data Science.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg',
      price: 29.99,
      category: 'Data Science'
    },
    {
      id: 10,
      title: 'UI/UX Design Masterclass',
      description: 'Projektowanie interfejsów w Figma. Teoria kolorów, typografia i prototypowanie.',
      image: 'https://s3-alpha.figma.com/hub/file/1481185752/fc90e7a2-f87c-41c3-9d41-3b7630737a23-cover.png',
      price: 59.99,
      category: 'Design'
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  
  const navigate = useNavigate();

  const handleAddToCart = (course) => {
    setCart((prev) => [...prev, course]);
  };

  const handleRemoveFromCart = (courseId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== courseId));
  };

  const filteredCourses = courses.filter((course) => {
    return course.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className='app-main'>
      <Navbar onSearch={setSearchTerm} cartCount={cart.length} />

      <Routes>
        
        <Route path="/" element={
          <div className='app-container'>
            <header>
              <h1 className='main-title'>Dostępne Kursy</h1>
            </header>
            <main className='courses-grid'>
              {filteredCourses.map((course) => (
                 <CourseCard
                   key={course.id}
                   title={course.title}
                   description={course.description}
                   image={course.image}
                   price={course.price}
                   category={course.category}
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

      </Routes>
    </div>
  );
}

export default App;