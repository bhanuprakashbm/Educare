const Faculty = require('../models/Faculty');

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Private (Admin)
const getAllFaculty = async (req, res, next) => {
  try {
    const { department, designation, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (designation) filter.designation = designation;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const faculty = await Faculty.find(filter)
      .populate('user', 'name email')
      .populate('institution', 'name aisheCode')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Faculty.countDocuments(filter);

    res.json({
      success: true,
      count: faculty.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      faculty,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single faculty
// @route   GET /api/faculty/:id
// @access  Private
const getFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('user', 'name email profilePicture')
      .populate('institution', 'name aisheCode');

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    res.json({ success: true, faculty });
  } catch (error) {
    next(error);
  }
};

// @desc    Create faculty profile
// @route   POST /api/faculty
// @access  Private (Admin)
const createFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json({ success: true, message: 'Faculty created successfully', faculty });
  } catch (error) {
    next(error);
  }
};

// @desc    Update faculty
// @route   PUT /api/faculty/:id
// @access  Private (Admin)
const updateFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    res.json({ success: true, message: 'Faculty updated successfully', faculty });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
// @access  Private (Admin)
const deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    res.json({ success: true, message: 'Faculty deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get faculty stats
// @route   GET /api/faculty/stats
// @access  Private (Admin)
const getFacultyStats = async (req, res, next) => {
  try {
    const total = await Faculty.countDocuments();
    const byDesignation = await Faculty.aggregate([
      { $group: { _id: '$designation', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const byDepartment = await Faculty.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const avgPerformance = await Faculty.aggregate([
      {
        $group: {
          _id: null,
          avgTeaching: { $avg: '$performance.teachingScore' },
          avgResearch: { $avg: '$performance.researchScore' },
          avgAPAR: { $avg: '$performance.overallAPARScore' },
        },
      },
    ]);

    res.json({
      success: true,
      total,
      byDesignation,
      byDepartment,
      averagePerformance: avgPerformance[0] || {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllFaculty, getFaculty, createFaculty, updateFaculty, deleteFaculty, getFacultyStats };
