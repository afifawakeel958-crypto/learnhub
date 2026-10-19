import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const empty = { title: '', description: '', category: '', price: '' };

// Used for both creating and editing a course
export default function CourseForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial || empty);
  useEffect(() => setForm(initial || empty), [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, price: Number(form.price) });
    if (!initial) setForm(empty);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" value={form.title} onChange={handleChange} required />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control name="category" value={form.category} onChange={handleChange} required />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className="mb-3">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={handleChange} required />
      </Form.Group>
      <Button type="submit" disabled={submitting}>{initial ? 'Update Course' : 'Add Course'}</Button>
      {onCancel && <Button variant="secondary" className="ms-2" onClick={onCancel}>Cancel</Button>}
    </Form>
  );
}
