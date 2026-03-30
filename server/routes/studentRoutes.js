const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudent,
  getStudentByAadhar,
  createStudent,
  updateStudent,
  addAcademicRecord,
  deleteStudent,
  getStudentStats,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/stats', authorize('admin'), getStudentStats);
router.get('/aadhar/:aadhar', authorize('admin'), getStudentByAadhar);
router.route('/').get(authorize('admin', 'faculty'), getStudents).post(authorize('admin'), createStudent);
router.route('/:id').get(getStudent).put(authorize('admin', 'faculty'), updateStudent).delete(authorize('admin'), deleteStudent);
router.post('/:id/academic-records', authorize('admin', 'faculty'), addAcademicRecord);

module.exports = router;
