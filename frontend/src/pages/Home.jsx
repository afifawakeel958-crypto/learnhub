import { useEffect, useState } from 'react';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';

const features = [
  ['🎓', 'Expert Instructors', 'Learn from instructors who create and manage structured, lesson-based courses.'],
  ['📈', 'Track Your Progress', 'Enroll in a click and follow your progress on your personal student dashboard.'],
  ['🔒', 'Secure & Role-Based', 'JWT authentication and role-based access keep students, instructors and admins separate.'],
];

const steps = [
  ['1', 'Create an account', 'Register as a student or an instructor in less than a minute.'],
  ['2', 'Find a course', 'Browse, search and filter courses by title and category.'],
  ['3', 'Start learning', 'Enroll, open lessons and track your progress from the dashboard.'],
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    api.get('/courses').then((res) => setCourses(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(courses.map((c) => c.category))];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/courses?search=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* HERO */}
      <section className="hero2">
        <Row className="align-items-center">
          <Col lg={7}>
            <span className="hero-pill">🚀 The smarter way to learn online</span>
            <h1 className="mb-3">Learn new skills.<br />Build your future.</h1>
            <p className="lead mb-4">
              Discover practical courses in web development, databases, security and more.
              Enroll in one click and track your progress.
            </p>
            <form className="hero-search" onSubmit={handleSearch}>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What do you want to learn today?" />
              <Button type="submit" variant="primary">Search</Button>
            </form>
            <div className="hero-points">
              <span>✔ Structured lessons</span>
              <span>✔ Progress tracking</span>
              <span>✔ Learn at your pace</span>
            </div>
          </Col>
          <Col lg={5} className="d-none d-lg-block">
            <div className="preview-stack">
              <div className="preview-card one">
                <small className="text-muted">Web Development</small>
                <div className="fw-bold">React JS for Beginners</div>
                <div className="bar"><span style={{ width: '65%' }} /></div>
                <small className="text-muted">65% complete</small>
              </div>
              <div className="preview-card two">
                <small className="text-muted">Backend</small>
                <div className="fw-bold">Node.js &amp; Express</div>
                <div className="bar"><span style={{ width: '30%' }} /></div>
                <small className="text-muted">30% complete</small>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="section text-center">
          <h2 className="section-title">Explore by category</h2>
          <p className="section-sub">Pick a topic and start learning.</p>
          {categories.map((cat) => (
            <Link key={cat} className="chip" to={`/courses?category=${encodeURIComponent(cat)}`}>{cat}</Link>
          ))}
        </section>
      )}

      {/* FEATURES */}
      <section className="section">
        <h2 className="section-title">Why choose LearnHub?</h2>
        <p className="section-sub">Everything you need for a smooth learning experience.</p>
        <Row xs={1} md={3} className="g-4">
          {features.map(([icon, title, text]) => (
            <Col key={title}>
              <div className="feature">
                <div className="feature-icon">{icon}</div>
                <h5>{title}</h5>
                <p className="text-muted mb-0">{text}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* LATEST COURSES */}
      <section className="section">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="mb-1">Latest courses</h2>
            <span className="text-muted">Freshly added by our instructors</span>
          </div>
          <Button as={Link} to="/courses" variant="outline-primary">View all</Button>
        </div>
        {loading ? <Spinner animation="border" /> : (
          <Row xs={1} md={3} className="g-4">
            {courses.slice(0, 3).map((c) => <Col key={c._id}><CourseCard course={c} /></Col>)}
          </Row>
        )}
        {!loading && courses.length === 0 && <p className="text-muted">No courses yet.</p>}
      </section>

      {/* HOW IT WORKS */}
      <section className="section text-center">
        <h2 className="section-title">How it works</h2>
        <p className="section-sub">Get started in three simple steps.</p>
        <Row xs={1} md={3} className="g-4">
          {steps.map(([n, title, text]) => (
            <Col key={n}>
              <div className="step-num">{n}</div>
              <h5>{title}</h5>
              <p className="text-muted">{text}</p>
            </Col>
          ))}
        </Row>
      </section>

      {/* CTA */}
      {!user && (
        <section className="section">
          <div className="cta">
            <h2 className="mb-2">Ready to start learning?</h2>
            <p className="mb-4" style={{ color: '#c7d2fe' }}>Join LearnHub today and enroll in your first course.</p>
            <Button as={Link} to="/register" variant="light" size="lg">Create free account</Button>
          </div>
        </section>
      )}
    </>
  );
}