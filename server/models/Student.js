const mongoose = require('mongoose');

const academicRecordSchema = new mongoose.Schema({
  semester: { type: Number, required: true },
  year: { type: Number, required: true },
  sgpa: { type: Number, min: 0, max: 10 },
  cgpa: { type: Number, min: 0, max: 10 },
  backlogs: { type: Number, default: 0 },
  subjects: [
    {
      name: String,
      code: String,
      marks: Number,
      maxMarks: Number,
      grade: String,
    },
  ],
});

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Unique Identifier
    aadharNumber: {
      type: String,
      required: [true, 'Aadhar number is required'],
      unique: true,
      match: [/^\d{12}$/, 'Aadhar must be a 12-digit number'],
    },
    usn: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
    // Personal Details
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    phone: { type: String, match: [/^\d{10}$/, 'Enter valid 10-digit phone'] },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    // Academic Details
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institution',
    },
    department: { type: String, required: true },
    program: { type: String, required: true },  // B.E, MCA, MBA etc.
    batch: { type: String, required: true },     // e.g. "2022-2026"
    currentSemester: { type: Number, default: 1 },
    admissionYear: { type: Number, required: true },
    // Status
    status: {
      type: String,
      enum: ['active', 'graduated', 'dropped', 'on-leave'],
      default: 'active',
    },
    // Academic Records
    academicRecords: [academicRecordSchema],
    // Attendance
    attendance: {
      percentage: { type: Number, default: 0, min: 0, max: 100 },
      totalClasses: { type: Number, default: 0 },
      attendedClasses: { type: Number, default: 0 },
    },
    // Government Schemes
    governmentSchemes: [
      {
        schemeName: String,
        schemeId: String,
        benefitAmount: Number,
        startDate: Date,
        status: { type: String, enum: ['active', 'completed', 'pending'] },
      },
    ],
    // Placement / Post-graduation
    placement: {
      isPlaced: { type: Boolean, default: false },
      company: String,
      package: Number, // in LPA
      joiningDate: Date,
      role: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
