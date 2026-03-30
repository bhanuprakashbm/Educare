const express = require('express');
const router = express.Router();
const {
  analyzeReport, predictCGPA, attendanceRisk, generatePerformanceCard, peerComparison,
  generateAPARScore, analyzeResearchImpact, analyzeFacultyWorkload,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

// Student AI routes
router.post('/analyze-report', analyzeReport);
router.post('/predict-cgpa', predictCGPA);
router.get('/attendance-risk', attendanceRisk);
router.post('/performance-card', generatePerformanceCard);
router.post('/peer-comparison', peerComparison);

// Faculty AI routes
router.post('/apar-score', generateAPARScore);
router.post('/research-impact', analyzeResearchImpact);
router.get('/faculty-workload', analyzeFacultyWorkload);

module.exports = router;
