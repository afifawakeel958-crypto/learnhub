const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const canModify = (course, user) =>
  user.role === 'admin' || course.instructor.toString() === user._id.toString();

// GET /api/courses?search=&category=
exports.getCourses = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };
    const courses = await Course.find(filter).populate('instructor', 'name email').sort('-createdAt');
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/:id
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    next(err);
  }
};

// POST /api/courses  (instructor, admin)
exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, category, price } = req.body;
    const course = await Course.create({ title, description, category, price, instructor: req.user._id });
    res.status(201).json(await course.populate('instructor', 'name email'));
  } catch (err) {
    next(err);
  }
};

// PUT /api/courses/:id  (owner instructor, admin)
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!canModify(course, req.user)) return res.status(403).json({ message: 'You can only edit your own courses' });
    ['title', 'description', 'category', 'price'].forEach((f) => {
      if (req.body[f] !== undefined) course[f] = req.body[f];
    });
    await course.save();
    res.json(await course.populate('instructor', 'name email'));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/courses/:id  (owner instructor, admin)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!canModify(course, req.user)) return res.status(403).json({ message: 'You can only delete your own courses' });
    await Enrollment.deleteMany({ course: course._id });
    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (err) {
    next(err);
  }
};

// POST /api/courses/:id/lessons  (owner instructor, admin) - upload lessons
exports.addLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!canModify(course, req.user)) return res.status(403).json({ message: 'You can only add lessons to your own courses' });
    course.lessons.push({ title: req.body.title, content: req.body.content, videoUrl: req.body.videoUrl });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/courses/:id/lessons/:lessonId
exports.deleteLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!canModify(course, req.user)) return res.status(403).json({ message: 'Not allowed' });
    course.lessons.pull(req.params.lessonId);
    await course.save();
    res.json(course);
  } catch (err) {
    next(err);
  }
};
