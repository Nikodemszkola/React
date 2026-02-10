import React from 'react';

function CartItem({ item, onRemove }) {
  const formatPrice = (price) =>
    new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(price);

  return (
    <div className="cart-item">
      <div className="cart-item-img-wrapper">
        <img src={item.image} alt={item.title} className="cart-item-img" onError={(e) => {e.target.src = 'https://bliskiepodroze.frysztak.pl/wp-content/uploads/2019/07/brak-zdjecia.png'}}/>
      </div>

      <div className="cart-item-info">
        <h3 className="cart-item-title">{item.title}</h3>
        <span className="cart-item-category">{item.category}</span>
      </div>

      <div className="cart-item-actions">
        <span className="cart-item-price">{formatPrice(item.price)}</span>
        <button className="remove-btn" onClick={() => onRemove(item.id)}title="Usuń z koszyka">

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CartItem;