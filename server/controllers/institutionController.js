const Institution = require('../models/Institution');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// @desc    Get all institutions
// @route   GET /api/institutions
// @access  Private
const getInstitutions = async (req, res, next) => {
  try {
    const { type, state, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (state) filter['address.state'] = state;

    const skip = (page - 1) * limit;
    const institutions = await Institution.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ name: 1 });

    const total = await Institution.countDocuments(filter);

    res.json({
      success: true,
      count: institutions.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      institutions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single institution
// @route   GET /api/institutions/:id
// @access  Private
const getInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) {
      return res.status(404).json({ success: false, message: 'Institution not found' });
    }
    res.json({ success: true, institution });
  } catch (error) {
    next(error);
  }
};

// @desc    Create institution
// @route   POST /api/institutions
// @access  Private (Admin)
const createInstitution = async (req, res, next) => {
  try {
    req.body.managedBy = req.user.id;
    const institution = await Institution.create(req.body);
    res.status(201).json({ success: true, message: 'Institution created successfully', institution });
  } catch (error) {
    next(error);
  }
};

// @desc    Update institution
// @route   PUT /api/institutions/:id
// @access  Private (Admin)
const updateInstitution = async (req, res, next) => {
  try {
    const institution = await Institution.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!institution) {
      return res.status(404).json({ success: false, message: 'Institution not found' });
    }
    res.json({ success: true, message: 'Institution updated successfully', institution });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform-wide analytics
// @route   GET /api/institutions/analytics
// @access  Private (Admin)
const getPlatformAnalytics = async (req, res, next) => {
  try {
    const totalInstitutions = await Institution.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();

    const activeStudents = await Student.countDocuments({ status: 'active' });
    const graduatedStudents = await Student.countDocuments({ status: 'graduated' });
    const placedStudents = await Student.countDocuments({ 'placement.isPlaced': true });

    const activeFaculty = await Faculty.countDocuments({ status: 'active' });

    const institutionsByType = await Institution.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const studentsByDept = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      overview: {
        totalInstitutions,
        totalStudents,
        totalFaculty,
        activeStudents,
        graduatedStudents,
        placedStudents,
        activeFaculty,
        placementRate: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0,
      },
      institutionsByType,
      studentsByDept,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getInstitutions, getInstitution, createInstitution, updateInstitution, getPlatformAnalytics };
