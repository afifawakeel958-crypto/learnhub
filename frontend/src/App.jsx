import { Routes, Route, Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import AppNavbar from './components/AppNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Unauthorized, NotFound } from './pages/Unauthorized';

export default function App() {
  return (
    <>
      <AppNavbar />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute roles={['admin', 'instructor', 'student']}><Dashboard /></ProtectedRoute>} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>

      <footer className="site-footer">
        <Container>
          <Row className="g-4">
            <Col md={5}>
              <h6>LearnHub</h6>
              <p>A MERN stack Learning Management System where students learn, instructors teach and admins manage everything.</p>
            </Col>
            <Col xs={6} md={3}>
              <h6>Explore</h6>
              <Link to="/">Home</Link>
              <Link to="/courses">Courses</Link>
              <Link to="/dashboard">Dashboard</Link>
            </Col>
            <Col xs={6} md={4}>
              <h6>Account</h6>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </Col>
          </Row>
          <div className="footer-bottom text-center">&copy; {new Date().getFullYear()} LearnHub. Built with MongoDB, Express, React and Node.js.</div>
        </Container>
      </footer>
    </>
  );
}