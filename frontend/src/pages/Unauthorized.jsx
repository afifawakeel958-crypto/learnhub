import { Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function Unauthorized() {
  return <Alert variant="warning"><strong>Access denied.</strong> Your role does not allow you to view this page. <Link to="/dashboard">Back to dashboard</Link></Alert>;
}

export function NotFound() {
  return <Alert variant="secondary"><strong>404.</strong> Page not found. <Link to="/">Go home</Link></Alert>;
}
