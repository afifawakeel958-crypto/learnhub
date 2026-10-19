const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// POST /api/enroll  { courseId }  (student)
exports.enroll = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: 'courseId is required' });
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (await Enrollment.findOne({ student: req.user._id, course: courseId })) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }
    const enrollment = await Enrollment.create({ student: req.user._id, course: courseId });
    res.status(201).json(enrollment);
  } catch (err) {
    next(err);
  }
};

// GET /api/my-courses  (student)
exports.myCourses = async (req, res, next) => {
  try {
    const list = await Enrollment.find({ student: req.user._id })
      .populate({ path: 'course', populate: { path: 'instructor', select: 'name' } })
      .sort('-createdAt');
    res.json(list.filter((e) => e.course)); // skip enrollments whose course was removed
  } catch (err) {
    next(err);
  }
};

// PUT /api/enroll/:id/progress  { progress }  (student)
exports.updateProgress = async (req, res, next) => {
  try {
    const progress = Number(req.body.progress);
    if (Number.isNaN(progress) || progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be a number between 0 and 100' });
    }
    const enrollment = await Enrollment.findOne({ _id: req.params.id, student: req.user._id });
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    enrollment.progress = progress;
    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    next(err);
  }
};
