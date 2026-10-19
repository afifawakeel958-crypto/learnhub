import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Badge, Button, Alert, ListGroup, Spinner } from 'react-bootstrap';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/courses/${id}`).then((res) => setCourse(res.data)).catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  const handleEnroll = async () => {
    setMessage(''); setError('');
    try {
      await api.post('/enroll', { courseId: id });
      setMessage('Enrolled successfully! Find it in your dashboard.');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (error && !course) return <Alert variant="danger">{error}</Alert>;
  if (!course) return <Spinner animation="border" />;

  return (
    <Card className="stat-card">
      <Card.Body>
        <Badge bg="primary">{course.category}</Badge>
        <h2 className="mt-2">{course.title}</h2>
        <p className="text-muted">Instructor: {course.instructor?.name} | Price: <strong>${course.price}</strong></p>
        <p>{course.description}</p>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {user?.role === 'student' && <Button onClick={handleEnroll}>Enroll Now</Button>}
        {!user && <Button as={Link} to="/login" variant="outline-primary">Login to enroll</Button>}

        <h5 className="mt-4">Lessons ({course.lessons.length})</h5>
        {course.lessons.length === 0 ? <p className="text-muted">No lessons uploaded yet.</p> : (
          <ListGroup>
            {course.lessons.map((l, i) => (
              <ListGroup.Item key={l._id}>
                <strong>{i + 1}. {l.title}</strong>
                {l.content && <div className="text-muted small">{l.content}</div>}
                {l.videoUrl && <a href={l.videoUrl} target="_blank" rel="noreferrer" className="small">Watch video</a>}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}
