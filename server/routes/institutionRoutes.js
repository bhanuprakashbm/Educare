const express = require('express');
const router = express.Router();
const {
  getInstitutions,
  getInstitution,
  createInstitution,
  updateInstitution,
  getPlatformAnalytics,
} = require('../controllers/institutionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/analytics', authorize('admin'), getPlatformAnalytics);
router.route('/').get(getInstitutions).post(authorize('admin'), createInstitution);
router.route('/:id').get(getInstitution).put(authorize('admin'), updateInstitution);

module.exports = router;
