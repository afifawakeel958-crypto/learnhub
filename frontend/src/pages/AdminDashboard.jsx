import { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Alert, Form } from 'react-bootstrap';
import api, { getErrorMessage } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [s, u, c] = await Promise.all([api.get('/admin/stats'), api.get('/admin/users'), api.get('/courses')]);
      setStats(s.data); setUsers(u.data); setCourses(c.data);
    } catch (e) { setError(getErrorMessage(e)); }
  };
  useEffect(() => { load(); }, []);

  const changeRole = async (id, role) => {
    try { await api.put(`/admin/users/${id}`, { role }); load(); } catch (e) { setError(getErrorMessage(e)); }
  };
  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await api.delete(`/admin/users/${id}`); load(); } catch (e) { setError(getErrorMessage(e)); }
  };
  const deleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try { await api.delete(`/courses/${id}`); load(); } catch (e) { setError(getErrorMessage(e)); }
  };

  return (
    <>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {stats && (
        <Row xs={2} md={5} className="g-3 mb-4">
          {[['Users', stats.users], ['Students', stats.students], ['Instructors', stats.instructors], ['Courses', stats.courses], ['Enrollments', stats.enrollments]].map(([label, val]) => (
            <Col key={label}><Card className="stat-card text-center"><Card.Body>
              <div className="display-6">{val}</div><div className="text-muted">{label}</div>
            </Card.Body></Card></Col>
          ))}
        </Row>
      )}

      {stats?.popular?.length > 0 && (
        <Card className="stat-card mb-4"><Card.Body>
          <h5>Most Popular Courses</h5>
          <ol className="mb-0">{stats.popular.map((p) => <li key={p.title}>{p.title} - {p.count} enrollment(s)</li>)}</ol>
        </Card.Body></Card>
      )}

      <h5>Manage Users</h5>
      <Table responsive hover className="bg-white mb-4">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td><td>{u.email}</td>
              <td style={{ width: 160 }}>
                <Form.Select size="sm" value={u.role} onChange={(e) => changeRole(u._id, e.target.value)}>
                  <option value="student">student</option><option value="instructor">instructor</option><option value="admin">admin</option>
                </Form.Select>
              </td>
              <td><Button size="sm" variant="outline-danger" onClick={() => deleteUser(u._id)}>Delete</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h5>Manage Courses</h5>
      <Table responsive hover className="bg-white">
        <thead><tr><th>Title</th><th>Instructor</th><th>Category</th><th>Price</th><th>Action</th></tr></thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c._id}>
              <td>{c.title}</td><td>{c.instructor?.name}</td><td>{c.category}</td><td>${c.price}</td>
              <td><Button size="sm" variant="outline-danger" onClick={() => deleteCourse(c._id)}>Delete</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
