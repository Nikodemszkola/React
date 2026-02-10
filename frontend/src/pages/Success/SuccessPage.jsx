import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SuccessPage.css";

function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // jeśli użytkownik jest zalogowany, odśwież koszyk backendowy
    if (window.isLoggedIn && window.refreshBasket) {
      window.refreshBasket();
    }
  }, []);

  return (
    <div className="success-container">
      <h1>Dziękujemy za zakup!</h1>
      <p>Twoja płatność została pomyślnie przetworzona.</p>

      <button className="success-btn" onClick={() => navigate("/moje-kursy")}>
        Przejdź do moich kursów
      </button>

      <button className="success-btn secondary" onClick={() => navigate("/")}>
        Wróć do sklepu
      </button>
    </div>
  );
}

export default SuccessPage;
