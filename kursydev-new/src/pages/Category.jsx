import { useParams } from 'react-router-dom';
import './Category.css';

function Category({ categories }) {
  const { categoryId, subcategoryId } = useParams();
  const category = categories.find((c) => String(c.id) === String(categoryId));

  return (
    <section className="category">
      <h2>Kategoria</h2>
      {category ? (
        <div>
          <p><strong>{category.name}</strong></p>
          {subcategoryId ? (
            <p>Podkategoria ID: {subcategoryId}</p>
          ) : (
            <p>Wybierz podkategorie z menu Przegladaj.</p>
          )}
        </div>
      ) : (
        <p>Nie znaleziono kategorii.</p>
      )}
    </section>
  );
}

export default Category;