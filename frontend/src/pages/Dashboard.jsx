import { Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import InstructorDashboard from './InstructorDashboard';
import AdminDashboard from './AdminDashboard';

// Shows a different dashboard depending on the logged-in user's role
export default function Dashboard() {
  const { user } = useAuth();
  return (
    <Container className="px-0">
      <h2 className="mb-1">Welcome, {user.name}</h2>
      <p className="text-muted text-capitalize">{user.role} dashboard</p>
      {user.role === 'student' && <StudentDashboard />}
      {user.role === 'instructor' && <InstructorDashboard />}
      {user.role === 'admin' && <AdminDashboard />}
    </Container>
  );
}
