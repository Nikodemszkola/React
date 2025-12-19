import React from 'react';
import CartItem from './components/CartItem';
import './CartPage.css';

function CartPage({ cartItems, onRemoveFromCart, onBackToShop }) {

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const formatPrice = (price) =>
    new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(price);

  return (
    <div className="cart-page-container">
        
      <button className="back-btn" onClick={onBackToShop}>
        ← Wróć do sklepu
      </button>

      <h2 className="cart-header">Twój Koszyk ({cartItems.length})</h2>

      {cartItems.length > 0 ? (
        <div className="cart-layout">
          
          <div className="cart-list">
            {cartItems.map((item) => (
              <CartItem 
                key={item.id} 
                item={item} 
                onRemove={onRemoveFromCart} 
              />
            ))}
          </div>

          <div className="cart-summary">
            <h3>Podsumowanie</h3>
            <div className="summary-row">
              <span>Wartość produktów:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="summary-row total">
              <span>Do zapłaty:</span>
              <span className="total-price">{formatPrice(totalPrice)}</span>
            </div>
            <button className="checkout-btn">Przejdź do płatności</button>
          </div>

        </div>
      ) : (
        <div className="empty-cart-message">
            <h3>Twój koszyk jest pusty.</h3>
            <p>Dodaj kursy, aby rozpocząć naukę!</p>
        </div>
      )}
    </div>
  );
}

export default CartPage;