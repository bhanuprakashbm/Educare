const express = require('express');
const router = express.Router();
const {
  getAllFaculty,
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyStats,
} = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/stats', authorize('admin'), getFacultyStats);
router.route('/').get(authorize('admin'), getAllFaculty).post(authorize('admin'), createFaculty);
router.route('/:id').get(authorize('admin', 'faculty'), getFaculty).put(authorize('admin'), updateFaculty).delete(authorize('admin'), deleteFaculty);

module.exports = router;
