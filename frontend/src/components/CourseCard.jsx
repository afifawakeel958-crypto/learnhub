import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const THEMES = [
  ['#4f46e5', '#7c3aed', '💻'],
  ['#0ea5e9', '#2563eb', '🚀'],
  ['#10b981', '#059669', '📊'],
  ['#f59e0b', '#ef4444', '🎨'],
  ['#ec4899', '#8b5cf6', '🔐'],
  ['#14b8a6', '#0ea5e9', '🗄️'],
];

// Same category always gets the same colour
const themeFor = (text = '') => {
  let n = 0;
  for (const ch of text) n += ch.charCodeAt(0);
  return THEMES[n % THEMES.length];
};

export default function CourseCard({ course }) {
  const [c1, c2, emoji] = themeFor(course.category);
  const instructor = course.instructor?.name || 'Unknown';

  return (
    <div className="course-card h-100 d-flex flex-column">
      <div className="course-banner" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
        <span className="emoji">{emoji}</span>
        <span className="cat">{course.category}</span>
      </div>
      <div className="p-3 d-flex flex-column flex-grow-1">
        <h5 className="mb-2">{course.title}</h5>
        <p className="text-muted small flex-grow-1">
          {course.description.length > 95 ? course.description.slice(0, 95) + '...' : course.description}
        </p>
        <div className="d-flex align-items-center mb-3 small text-muted">
          <span className="avatar">{instructor.charAt(0)}</span> {instructor}
          <span className="ms-auto">{course.lessons?.length || 0} lessons</span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="price">${course.price}</span>
          <Button as={Link} to={`/courses/${course._id}`} size="sm" variant="outline-primary">View Details</Button>
        </div>
      </div>
    </div>
  );
}