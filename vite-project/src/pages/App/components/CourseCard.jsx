import React from 'react';

function CourseCard({ image, title, description, price, category, subcategories, onAddToCart, isInCart }) {
  const normalizedImage =
    image && !image.startsWith('http') && !image.startsWith('/') ? `/${image}` : image;
  return (
    <article className='course-card'>
      <div className='course-image-wrapper'>
        <img
          src={normalizedImage}
          alt={title}
          className='course-image'
          onError={(e) => { e.target.src = 'https://bliskiepodroze.frysztak.pl/wp-content/uploads/2019/07/brak-zdjecia.png'; }}
        />
        {category && <span className='course-category'>{category}</span>}

        {subcategories && (
          <div className="course-subcategories">
            {subcategories.map((sub, i) => (
              <span key={i} className="course-sub">
                {sub}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className='course-content'>
        <h2 className='course-title'>{title}</h2>
        <p className='course-description'>{description}</p>

        <div className='course-footer'>
          <span className='course-price'>{price} zl</span>
          <button
            type='button'
            className={`add-to-cart-btn ${isInCart ? 'btn-disabled' : ''}`}
            onClick={() => !isInCart && onAddToCart()}
            disabled={isInCart}
          >
            {isInCart ? 'W koszyku' : 'Dodaj do koszyka'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
