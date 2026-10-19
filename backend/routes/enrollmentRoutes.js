const router = require('express').Router();
const e = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/enroll', protect, authorize('student'), e.enroll);
router.put('/enroll/:id/progress', protect, authorize('student'), e.updateProgress);
router.get('/my-courses', protect, authorize('student'), e.myCourses);

module.exports = router;
