import { useEffect, useState } from 'react';
import { Card, Table, Button, Alert, Form, Modal } from 'react-bootstrap';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CourseForm from '../components/CourseForm';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [lessonFor, setLessonFor] = useState(null);
  const [lesson, setLesson] = useState({ title: '', content: '', videoUrl: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () =>
    api.get('/courses').then((res) => setCourses(res.data.filter((c) => c.instructor?._id === user._id))).catch((e) => setError(getErrorMessage(e)));
  useEffect(() => { load(); }, []);

  const flash = (msg) => { setSuccess(msg); setError(''); setTimeout(() => setSuccess(''), 3000); };

  const saveCourse = async (data) => {
    try {
      if (editing) { await api.put(`/courses/${editing._id}`, data); setEditing(null); flash('Course updated'); }
      else { await api.post('/courses', data); flash('Course added'); }
      load();
    } catch (e) { setError(getErrorMessage(e)); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try { await api.delete(`/courses/${id}`); flash('Course deleted'); load(); }
    catch (e) { setError(getErrorMessage(e)); }
  };

  const addLesson = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/courses/${lessonFor._id}/lessons`, lesson);
      setLessonFor(null); setLesson({ title: '', content: '', videoUrl: '' });
      flash('Lesson uploaded'); load();
    } catch (err) { setError(getErrorMessage(err)); }
  };

  return (
    <>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="stat-card mb-4"><Card.Body>
        <h5>{editing ? 'Edit Course' : 'Add New Course'}</h5>
        <CourseForm initial={editing} onSubmit={saveCourse} onCancel={editing ? () => setEditing(null) : null} />
      </Card.Body></Card>

      <h5>My Courses ({courses.length})</h5>
      <Table responsive hover className="bg-white">
        <thead><tr><th>Title</th><th>Category</th><th>Price</th><th>Lessons</th><th>Actions</th></tr></thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c._id}>
              <td>{c.title}</td><td>{c.category}</td><td>${c.price}</td><td>{c.lessons.length}</td>
              <td>
                <Button size="sm" variant="outline-primary" className="me-1" onClick={() => setEditing(c)}>Edit</Button>
                <Button size="sm" variant="outline-success" className="me-1" onClick={() => setLessonFor(c)}>Add Lesson</Button>
                <Button size="sm" variant="outline-danger" onClick={() => remove(c._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {courses.length === 0 && <Alert variant="info">You have not created any courses yet.</Alert>}

      <Modal show={!!lessonFor} onHide={() => setLessonFor(null)}>
        <Form onSubmit={addLesson}>
          <Modal.Header closeButton><Modal.Title>Add lesson to {lessonFor?.title}</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3"><Form.Label>Lesson title</Form.Label>
              <Form.Control value={lesson.title} onChange={(e) => setLesson({ ...lesson, title: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Content</Form.Label>
              <Form.Control as="textarea" rows={3} value={lesson.content} onChange={(e) => setLesson({ ...lesson, content: e.target.value })} /></Form.Group>
            <Form.Group><Form.Label>Video URL (optional)</Form.Label>
              <Form.Control value={lesson.videoUrl} onChange={(e) => setLesson({ ...lesson, videoUrl: e.target.value })} /></Form.Group>
          </Modal.Body>
          <Modal.Footer><Button type="submit">Upload Lesson</Button></Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
