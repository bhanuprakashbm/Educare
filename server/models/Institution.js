const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema(
  {
    // Unique Identifier (Government)
    aisheCode: {
      type: String,
      required: [true, 'AISHE Code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['University', 'Autonomous College', 'Affiliated College', 'Deemed University', 'IIT', 'NIT'],
      required: true,
    },
    // Contact & Location
    address: {
      street: String,
      city: String,
      district: String,
      state: String,
      pincode: String,
    },
    phone: String,
    email: String,
    website: String,
    // Administration
    principalName: String,
    establishedYear: Number,
    affiliatedUniversity: String,
    // NIRF Parameters
    nirf: {
      rank: { type: Number },
      year: { type: Number },
      teachingScore: { type: Number, min: 0, max: 100 },
      researchScore: { type: Number, min: 0, max: 100 },
      graduationOutcomeScore: { type: Number, min: 0, max: 100 },
      outreachScore: { type: Number, min: 0, max: 100 },
      perceptionScore: { type: Number, min: 0, max: 100 },
      overallScore: { type: Number, min: 0, max: 100 },
    },
    // Accreditation
    accreditation: {
      naaacGrade: { type: String, enum: ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C', 'Not Accredited'] },
      naaacScore: Number,
      nbaAccredited: { type: Boolean, default: false },
      validUntil: Date,
    },
    // Statistics
    stats: {
      totalStudents: { type: Number, default: 0 },
      totalFaculty: { type: Number, default: 0 },
      studentFacultyRatio: { type: Number, default: 0 },
      placementRate: { type: Number, default: 0 },
    },
    // Departments offered
    departments: [
      {
        name: String,
        code: String,
        hod: String,
        programs: [String],
      },
    ],
    // Compliance Status
    compliance: {
      ugcApproved: { type: Boolean, default: false },
      aicteApproved: { type: Boolean, default: false },
      lastAuditDate: Date,
      complianceStatus: {
        type: String,
        enum: ['compliant', 'partial', 'non-compliant'],
        default: 'partial',
      },
    },
    isActive: { type: Boolean, default: true },
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Institution', institutionSchema);
