const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin, Faculty)
const getStudents = async (req, res, next) => {
  try {
    const { department, status, program, batch, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (program) filter.program = program;
    if (batch) filter.batch = batch;

    const skip = (page - 1) * limit;
    const students = await Student.find(filter)
      .populate('user', 'name email')
      .populate('institution', 'name aisheCode')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(filter);

    res.json({
      success: true,
      count: students.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'name email profilePicture')
      .populate('institution', 'name aisheCode city');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student by Aadhar
// @route   GET /api/students/aadhar/:aadhar
// @access  Private (Admin)
const getStudentByAadhar = async (req, res, next) => {
  try {
    const student = await Student.findOne({ aadharNumber: req.params.aadhar })
      .populate('user', 'name email')
      .populate('institution', 'name aisheCode');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

// @desc    Create student profile
// @route   POST /api/students
// @access  Private (Admin)
const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, message: 'Student created successfully', student });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin, Faculty)
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student updated successfully', student });
  } catch (error) {
    next(error);
  }
};

// @desc    Add academic record
// @route   POST /api/students/:id/academic-records
// @access  Private (Admin, Faculty)
const addAcademicRecord = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    student.academicRecords.push(req.body);
    await student.save();

    res.status(201).json({ success: true, message: 'Academic record added', student });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student statistics
// @route   GET /api/students/stats
// @access  Private (Admin)
const getStudentStats = async (req, res, next) => {
  try {
    const stats = await Student.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const departmentStats = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const totalStudents = await Student.countDocuments();

    res.json({
      success: true,
      totalStudents,
      statusBreakdown: stats,
      departmentBreakdown: departmentStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudent,
  getStudentByAadhar,
  createStudent,
  updateStudent,
  addAcademicRecord,
  deleteStudent,
  getStudentStats,
};
