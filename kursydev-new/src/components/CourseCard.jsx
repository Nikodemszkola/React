import './CourseCard.css';

function CourseCard({ course, inCart, onAdd }) {
  const image = course.image && !course.image.startsWith('http') && !course.image.startsWith('/')
    ? `/${course.image}`
    : course.image;

  return (
    <article className="course-card">
      <div className="card-media">
        <img
          src={image}
          alt={course.title}
          onError={(e) => { e.target.src = 'https://bliskiepodroze.frysztak.pl/wp-content/uploads/2019/07/brak-zdjecia.png'; }}
        />
        {course.category && <span className="chip">{course.category}</span>}
      </div>
      <div className="card-body">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="card-footer">
          <span className="price">{course.price} zl</span>
          <button className={inCart ? 'disabled' : ''} onClick={onAdd} disabled={inCart}>
            {inCart ? 'W koszyku' : 'Dodaj'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;