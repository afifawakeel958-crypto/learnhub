import { useEffect, useState } from 'react';
import { Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import api, { getErrorMessage } from '../services/api';
import CourseCard from '../components/CourseCard';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/courses', { params: { search, category } })
      .then((res) => { setCourses(res.data); setError(''); })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <>
      <h2 className="mb-3">All Courses</h2>
      <Row className="mb-4 g-2">
        <Col md={8}><Form.Control placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} /></Col>
        <Col md={4}><Form.Control placeholder="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)} /></Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? <Spinner animation="border" /> : (
        <Row xs={1} md={3} className="g-4">
          {courses.map((c) => <Col key={c._id}><CourseCard course={c} /></Col>)}
        </Row>
      )}
      {!loading && !error && courses.length === 0 && <Alert variant="info">No courses found.</Alert>}
    </>
  );
}
