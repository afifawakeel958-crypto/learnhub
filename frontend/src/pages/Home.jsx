import { useEffect, useState } from 'react';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/CourseCard';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses').then((res) => setCourses(res.data.slice(0, 3))).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="hero p-5 mb-5 text-center">
        <h1 className="display-5 fw-bold">Learn without limits with LearnHub</h1>
        <p className="lead">Browse courses, enroll in one click and track your progress.</p>
        <Button as={Link} to="/courses" variant="light" size="lg" className="me-2">Browse Courses</Button>
        <Button as={Link} to="/register" variant="outline-light" size="lg">Get Started</Button>
      </div>
      <h3 className="mb-3">Latest Courses</h3>
      {loading ? <Spinner animation="border" /> : (
        <Row xs={1} md={3} className="g-4">
          {courses.map((c) => <Col key={c._id}><CourseCard course={c} /></Col>)}
        </Row>
      )}
      {!loading && courses.length === 0 && <p className="text-muted">No courses yet.</p>}
    </>
  );
}
