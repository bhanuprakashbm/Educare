const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Unique Identifier (Government)
    aparId: {
      type: String,
      required: [true, 'APAR ID is required'],
      unique: true,
      trim: true,
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    // Personal Details
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    phone: { type: String },
    // Professional Details
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
    },
    department: { type: String, required: true },
    designation: {
      type: String,
      enum: [
        'Professor',
        'Associate Professor',
        'Assistant Professor',
        'Lecturer',
        'HOD',
        'Principal',
        'Director',
      ],
      required: true,
    },
    specialization: [String],
    qualifications: [
      {
        degree: String,   // Ph.D, M.Tech, etc.
        field: String,
        institution: String,
        year: Number,
      },
    ],
    experience: {
      teaching: { type: Number, default: 0 }, // in years
      industry: { type: Number, default: 0 },
      research: { type: Number, default: 0 },
    },
    joiningDate: { type: Date },
    // Performance Metrics
    performance: {
      teachingScore: { type: Number, default: 0, min: 0, max: 100 },
      researchScore: { type: Number, default: 0, min: 0, max: 100 },
      overallAPARScore: { type: Number, default: 0, min: 0, max: 100 },
      lastAppraisalDate: Date,
      appraisalYear: Number,
    },
    // Research & Publications
    publications: [
      {
        title: String,
        journal: String,
        year: Number,
        impactFactor: Number,
        type: { type: String, enum: ['journal', 'conference', 'book', 'patent'] },
      },
    ],
    // Subjects handled
    subjectsTaught: [
      {
        name: String,
        code: String,
        semester: Number,
        academicYear: String,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'retired', 'on-leave', 'resigned'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faculty', facultySchema);
