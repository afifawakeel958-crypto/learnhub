import { useEffect, useState } from 'react';
import { Row, Col, Card, ProgressBar, Alert, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () =>
    api.get('/my-courses').then((res) => setEnrollments(res.data)).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const bump = async (en) => {
    try {
      await api.put(`/enroll/${en._id}/progress`, { progress: Math.min(100, en.progress + 20) });
      load();
    } catch (e) { setError(getErrorMessage(e)); }
  };

  if (loading) return <Spinner animation="border" />;
  return (
    <>
      <h4 className="mb-3">My Enrolled Courses</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {enrollments.length === 0 ? (
        <Alert variant="info">You have not enrolled in any course yet. <Link to="/courses">Browse courses</Link></Alert>
      ) : (
        <Row xs={1} md={2} className="g-3">
          {enrollments.map((en) => (
            <Col key={en._id}>
              <Card className="stat-card h-100"><Card.Body>
                <Card.Title>{en.course.title}</Card.Title>
                <small className="text-muted">Instructor: {en.course.instructor?.name}</small>
                <ProgressBar className="my-3" now={en.progress} label={`${en.progress}%`} />
                <Button size="sm" variant="outline-success" disabled={en.progress >= 100} onClick={() => bump(en)}>
                  {en.progress >= 100 ? 'Completed' : 'Mark +20% progress'}
                </Button>
                <Button as={Link} to={`/courses/${en.course._id}`} size="sm" variant="link">Open course</Button>
              </Card.Body></Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}
