import './Cart.css';

function Cart({ cartItems, onRemoveFromCart, onBackToShop }) {
  const total = cartItems.reduce((sum, i) => sum + i.price, 0);

  return (
    <section className="cart">
      <div className="cart-top">
        <button className="ghost-btn" onClick={onBackToShop}>Wroc do kursow</button>
        <h2>Koszyk</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">Koszyk jest pusty.</div>
      ) : (
        <div className="cart-grid">
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.category}</span>
                </div>
                <div className="cart-actions">
                  <span>{item.price} zl</span>
                  <button onClick={() => onRemoveFromCart(item.id)}>Usun</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Podsumowanie</h3>
            <div className="row"><span>Razem</span><strong>{total.toFixed(2)} zl</strong></div>
            <button className="solid-btn">Przejdz do platnosci</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;