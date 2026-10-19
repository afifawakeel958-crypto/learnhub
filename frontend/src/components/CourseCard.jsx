import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  return (
    <Card className="course-card h-100">
      <Card.Body className="d-flex flex-column">
        <Badge bg="primary" className="align-self-start mb-2">{course.category}</Badge>
        <Card.Title>{course.title}</Card.Title>
        <Card.Text className="text-muted flex-grow-1">
          {course.description.length > 90 ? course.description.slice(0, 90) + '...' : course.description}
        </Card.Text>
        <small className="text-muted mb-2">By {course.instructor?.name || 'Unknown'}</small>
        <div className="d-flex justify-content-between align-items-center">
          <strong>${course.price}</strong>
          <Button as={Link} to={`/courses/${course._id}`} size="sm" variant="outline-primary">View Details</Button>
        </div>
      </Card.Body>
    </Card>
  );
}
