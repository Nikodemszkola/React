import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getMyCourses } from "../../api.js";

function MyCoursesPage() {
  const [myCourses, setMyCourses] = useState([]);

  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (!user || !token) return;

    async function fetchMyCourses() {
      const data = await getMyCourses(user.id, token);
      setMyCourses(data);
    }

    fetchMyCourses();
  }, [user, token]);

  return (
    <div className="my-courses-page">
      <h1>Moje kursy</h1>

      {myCourses.length === 0 && <p>Nie masz jeszcze żadnych kursów.</p>}

      <div className="courses-grid">
        {myCourses.map(course => (
          <div key={course.id} className="course-card">
            <img src={course.image} alt={course.title} />
            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyCoursesPage;
