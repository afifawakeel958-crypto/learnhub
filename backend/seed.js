// Run: npm run seed   -> creates demo users and courses
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Course.deleteMany(), Enrollment.deleteMany()]);

  const admin = await User.create({ name: 'Admin User', email: 'admin@learnhub.com', password: 'admin123', role: 'admin' });
  const instructor = await User.create({ name: 'Ali Instructor', email: 'instructor@learnhub.com', password: 'instructor123', role: 'instructor' });
  const student = await User.create({ name: 'Sara Student', email: 'student@learnhub.com', password: 'student123', role: 'student' });

  const courses = await Course.insertMany([
    { title: 'React JS for Beginners', description: 'Learn components, props, state and hooks by building real UIs.', category: 'Web Development', price: 49, instructor: instructor._id,
      lessons: [{ title: 'Intro to React', content: 'What is React and why use it?' }, { title: 'Components & Props', content: 'Building reusable components.' }] },
    { title: 'Node.js & Express Masterclass', description: 'Build REST APIs with Node.js, Express and MongoDB.', category: 'Backend', price: 59, instructor: instructor._id,
      lessons: [{ title: 'Express Basics', content: 'Routing and middleware.' }] },
    { title: 'MongoDB Essentials', description: 'Document databases, schemas and Mongoose.', category: 'Database', price: 39, instructor: instructor._id },
    { title: 'JWT Authentication Explained', description: 'Secure your apps with JWT, Bcrypt and role-based access.', category: 'Security', price: 29, instructor: instructor._id },
  ]);

  await Enrollment.create({ student: student._id, course: courses[0]._id, progress: 40 });
  console.log('Seed complete.\n admin@learnhub.com / admin123\n instructor@learnhub.com / instructor123\n student@learnhub.com / student123');
  await mongoose.disconnect();
})();
