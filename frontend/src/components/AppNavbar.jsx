import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="md" sticky="top" className="app-navbar mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          <span className="brand-mark">L</span> LearnHub
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
            {user && <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>}
          </Nav>
          <Nav className="align-items-center">
            {user ? (
              <>
                <span className="me-3 fw-semibold">
                  {user.name} <Badge className="role-badge">{user.role}</Badge>
                </span>
                <Button variant="outline-primary" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Button as={Link} to="/register" variant="primary" size="sm" className="ms-2">Get Started</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}