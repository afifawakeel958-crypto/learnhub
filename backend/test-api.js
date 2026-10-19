// End-to-end API test. Start the server first (npm start), then: npm run test:api
// Uses only Node 18+ built-in fetch, no extra packages.
const BASE = process.env.API_URL || 'http://localhost:5000/api';
let passed = 0, failed = 0;

const call = async (method, path, body, token) => {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = {};
  try { data = await res.json(); } catch (e) {}
  return { status: res.status, data };
};
const check = (name, cond, extra = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name} ${cond ? '' : extra}`);
  cond ? passed++ : failed++;
};

(async () => {
  const stamp = Date.now();
  let r = await call('GET', '/health');
  check('Health check', r.status === 200);

  r = await call('POST', '/register', { name: 'Test Student', email: `s${stamp}@test.com`, password: 'secret12' });
  check('Register student -> 201', r.status === 201 && r.data.token, JSON.stringify(r.data));
  const studentToken = r.data.token;

  r = await call('POST', '/register', { name: 'Test Student', email: `s${stamp}@test.com`, password: 'secret12' });
  check('Duplicate email rejected -> 400', r.status === 400);

  r = await call('POST', '/register', { name: 'X', email: 'bad' });
  check('Invalid register rejected -> 400', r.status === 400);

  r = await call('POST', '/login', { email: `s${stamp}@test.com`, password: 'wrong' });
  check('Wrong password -> 401', r.status === 401);

  r = await call('POST', '/login', { email: `s${stamp}@test.com`, password: 'secret12' });
  check('Login student -> 200 + token', r.status === 200 && r.data.token);

  r = await call('POST', '/register', { name: 'Test Instructor', email: `i${stamp}@test.com`, password: 'secret12', role: 'instructor' });
  const instToken = r.data.token;
  check('Register instructor -> role instructor', r.data.user && r.data.user.role === 'instructor');

  r = await call('POST', '/register', { name: 'Hacker', email: `h${stamp}@test.com`, password: 'secret12', role: 'admin' });
  check('Cannot self-register as admin', r.data.user && r.data.user.role === 'student');

  r = await call('POST', '/courses', { title: 'No Auth', description: 'x', category: 'x', price: 1 });
  check('Create course without token -> 401', r.status === 401);

  r = await call('POST', '/courses', { title: 'Student Try', description: 'x', category: 'x', price: 1 }, studentToken);
  check('Student cannot create course -> 403', r.status === 403);

  r = await call('POST', '/courses', { title: 'Test Course', description: 'Desc', category: 'Testing', price: 10 }, instToken);
  check('Instructor creates course -> 201', r.status === 201, JSON.stringify(r.data));
  const courseId = r.data._id;

  r = await call('POST', '/courses', { title: 'Bad' }, instToken);
  check('Invalid course data -> 400', r.status === 400);

  r = await call('GET', '/courses');
  check('GET /courses lists courses', r.status === 200 && Array.isArray(r.data) && r.data.some((c) => c._id === courseId));

  r = await call('PUT', `/courses/${courseId}`, { price: 25 }, instToken);
  check('Instructor updates own course', r.status === 200 && r.data.price === 25);

  r = await call('POST', `/courses/${courseId}/lessons`, { title: 'Lesson 1', content: 'Hello' }, instToken);
  check('Instructor adds lesson -> 201', r.status === 201 && r.data.lessons.length === 1);

  r = await call('POST', '/enroll', { courseId }, studentToken);
  check('Student enrolls -> 201', r.status === 201, JSON.stringify(r.data));
  const enrollId = r.data._id;

  r = await call('POST', '/enroll', { courseId }, studentToken);
  check('Duplicate enrollment -> 400', r.status === 400);

  r = await call('POST', '/enroll', { courseId }, instToken);
  check('Instructor cannot enroll -> 403', r.status === 403);

  r = await call('GET', '/my-courses', null, studentToken);
  check('GET /my-courses returns enrollment', r.status === 200 && r.data.length === 1);

  r = await call('PUT', `/enroll/${enrollId}/progress`, { progress: 60 }, studentToken);
  check('Update progress -> 200', r.status === 200 && r.data.progress === 60);

  r = await call('GET', '/admin/users', null, studentToken);
  check('Student blocked from admin route -> 403', r.status === 403);

  r = await call('POST', '/login', { email: 'admin@learnhub.com', password: 'admin123' });
  const adminToken = r.data.token;
  check('Admin login (seeded) -> 200', r.status === 200, 'Run `npm run seed` first');

  r = await call('GET', '/admin/stats', null, adminToken);
  check('Admin views analytics -> 200', r.status === 200 && typeof r.data.users === 'number');

  r = await call('GET', '/admin/users', null, adminToken);
  check('Admin lists users -> 200', r.status === 200 && Array.isArray(r.data));

  r = await call('DELETE', `/courses/${courseId}`, null, instToken);
  check('Instructor deletes own course', r.status === 200);

  r = await call('GET', `/courses/${courseId}`);
  check('Deleted course -> 404', r.status === 404);

  console.log(`\nResult: ${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
