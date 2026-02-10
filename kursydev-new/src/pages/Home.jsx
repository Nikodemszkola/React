import CourseCard from '../components/CourseCard.jsx';
import './Home.css';

function Home({ courses, onAddToCart, cart, loading, search }) {
  return (
    <section className="home">
      <div className="hero">
        <div>
          <h1>Nowa kolekcja kursow</h1>
          <p>Rozwijaj umiejetnosci z praktycznymi kursami i szybkim dostepem.</p>
          <div className="hero-meta">
            <span>{courses.length} kursow</span>
            <span>Wyszukiwanie: {search ? search : 'brak'}</span>
          </div>
        </div>
        <div className="hero-card">
          <h3>Twoj plan</h3>
          <p>Dodawaj do koszyka i wroc do nauki kiedy chcesz.</p>
        </div>
      </div>

      {loading ? (
        <div className="state">Ladowanie...</div>
      ) : courses.length === 0 ? (
        <div className="state">Brak wynikow</div>
      ) : (
        <div className="grid">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              inCart={cart.some((item) => item.id === course.id)}
              onAdd={() => onAddToCart(course)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;