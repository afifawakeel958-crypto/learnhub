import { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setError(''); setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto stat-card" style={{ maxWidth: 460 }}>
      <Card.Body>
        <h3 className="mb-3">Create an account</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3"><Form.Label>Name</Form.Label>
            <Form.Control name="name" value={form.name} onChange={handleChange} required /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>I am a</Form.Label>
            <Form.Select name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </Form.Select></Form.Group>
          <Button type="submit" className="w-100" disabled={loading}>{loading ? 'Creating...' : 'Register'}</Button>
        </Form>
        <p className="mt-3 mb-0 text-center">Already registered? <Link to="/login">Login</Link></p>
      </Card.Body>
    </Card>
  );
}
