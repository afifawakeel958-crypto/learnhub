// Prints clean request/response evidence for the report.
// Usage (backend must be running): node api-demo.js 8     (figures: 8 9 10 11 12 18 21)
const BASE = process.env.API_URL || 'http://localhost:5000/api';

const line = () => console.log('-'.repeat(70));
async function call(title, method, path, body, token) {
  line();
  console.log(title);
  console.log(`REQUEST : ${method} ${BASE}${path}`);
  if (token) console.log(`HEADER  : Authorization: Bearer ${token.slice(0, 25)}...`);
  if (body) console.log(`BODY    : ${JSON.stringify(body)}`);
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = {};
  try { data = await res.json(); } catch (e) {}
  console.log(`STATUS  : ${res.status} ${res.statusText}`);
  let out = JSON.stringify(data, null, 2);
  if (out.length > 1800) out = out.slice(0, 1800) + '\n  ... (response shortened)';
  console.log('RESPONSE:\n' + out);
  line();
  return { status: res.status, data };
}
const login = async (email, password) =>
  (await (await fetch(BASE + '/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })).json()).token;

const figures = {
  8: () => call('Figure 8: GET /api/courses', 'GET', '/courses'),
  9: () => call('Figure 9: POST /api/register', 'POST', '/register',
        { name: 'Test User', email: `test${Date.now()}@mail.com`, password: '123456' }),
  10: () => call('Figure 10: POST /api/login (instructor)', 'POST', '/login',
        { email: 'instructor@learnhub.com', password: 'instructor123' }),
  11: async () => {
    const t = await login('instructor@learnhub.com', 'instructor123');
    await call('Figure 11: POST /api/courses (instructor token)', 'POST', '/courses',
      { title: 'Test Course', description: 'Demo course', category: 'Testing', price: 20 }, t);
  },
  12: async () => {
    const t = await login('instructor@learnhub.com', 'instructor123');
    const c = (await call('Setup: create a course to update/delete', 'POST', '/courses',
      { title: 'Temp Course', description: 'To be updated and deleted', category: 'Testing', price: 20 }, t)).data;
    await call('Figure 12a: PUT /api/courses/:id', 'PUT', `/courses/${c._id}`, { price: 30 }, t);
    await call('Figure 12b: DELETE /api/courses/:id', 'DELETE', `/courses/${c._id}`, null, t);
  },
  18: async () => {
    const t = await login('student@learnhub.com', 'student123');
    await call('Figure 18: GET /api/admin/users with STUDENT token (must be 403)', 'GET', '/admin/users', null, t);
  },
  21: async () => {
    const t = await login('student@learnhub.com', 'student123');
    const mine = (await call('Setup: current enrollments', 'GET', '/my-courses', null, t)).data;
    const taken = new Set(mine.map((e) => e.course._id));
    const all = (await (await fetch(BASE + '/courses')).json());
    const target = all.find((c) => !taken.has(c._id)) || all[0];
    await call(`Figure 21a: POST /api/enroll (${target.title})`, 'POST', '/enroll', { courseId: target._id }, t);
    await call('Figure 21b: GET /api/my-courses', 'GET', '/my-courses', null, t);
  },
};

const n = process.argv[2];
if (!figures[n]) {
  console.log('Usage: node api-demo.js <figure>   where figure is one of: ' + Object.keys(figures).join(', '));
  process.exit(1);
}
figures[n]().catch((e) => console.error('Request failed. Is the backend running? ', e.message));