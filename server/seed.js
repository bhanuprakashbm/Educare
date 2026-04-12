const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Institution = require('./models/Institution');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Institution.deleteMany({}),
      Student.deleteMany({}),
      Faculty.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // ── 1. Create Users ──────────────────────────────────────────
    const usersData = [
      { name: 'Admin User',        email: 'admin@educare.com',   password: 'admin123',   role: 'admin' },
      { name: 'Dr. Rajesh Kumar',  email: 'rajesh@educare.com',  password: 'faculty123', role: 'faculty' },
      { name: 'Dr. Priya Sharma',  email: 'priya@educare.com',   password: 'faculty123', role: 'faculty' },
      { name: 'Prof. Suresh Rao',  email: 'suresh@educare.com',  password: 'faculty123', role: 'faculty' },
      { name: 'Bhanu Prakash B M', email: 'bhanu@educare.com',   password: 'student123', role: 'student' },
      { name: 'Manu B M',          email: 'manu@educare.com',    password: 'student123', role: 'student' },
      { name: 'Koushik Gowda',     email: 'koushik@educare.com', password: 'student123', role: 'student' },
      { name: 'Spoorthi R',        email: 'spoorthi@educare.com',password: 'student123', role: 'student' },
      { name: 'Chethan Kumar',     email: 'chethan@educare.com', password: 'student123', role: 'student' },
    ];

    const createdUsers = await User.create(usersData);
    console.log(`👥 Created ${createdUsers.length} users`);

    const adminUser    = createdUsers.find(u => u.role === 'admin');
    const facultyUsers = createdUsers.filter(u => u.role === 'faculty');
    const studentUsers = createdUsers.filter(u => u.role === 'student');

    // ── 2. Create Institutions ────────────────────────────────────
    const institutionsData = [
      {
        aisheCode: 'C-45678',
        name: 'EduCare Demo Institution',
        type: 'Autonomous College',
        address: { street: 'Main Road', city: 'Demo City', district: 'Demo District', state: 'Demo State', pincode: '560001' },
        phone: '080-23211020',
        email: 'info@drait.edu.in',
        website: 'www.drait.edu.in',
        principalName: 'Dr. H.C. Nagaraj',
        establishedYear: 1980,
        affiliatedUniversity: 'Visvesvaraya Technological University',
        nirf: { rank: 152, year: 2024, teachingScore: 78.5, researchScore: 65.2, overallScore: 71.8 },
        accreditation: { naaacGrade: 'A', naaacScore: 3.12, nbaAccredited: true, validUntil: new Date('2027-06-30') },
        stats: { totalStudents: 3200, totalFaculty: 180, studentFacultyRatio: 17.8, placementRate: 88 },
        departments: [
          { name: 'Computer Science & Engineering', code: 'CSE', hod: 'Dr. Ramesh B', programs: ['B.E', 'M.Tech'] },
          { name: 'Electronics & Communication', code: 'ECE', hod: 'Dr. Kavitha S', programs: ['B.E', 'M.Tech'] },
          { name: 'Master of Computer Applications', code: 'MCA', hod: 'Dr. Suresh Rao', programs: ['MCA'] },
        ],
        compliance: { ugcApproved: true, aicteApproved: true, complianceStatus: 'compliant' },
        managedBy: adminUser._id,
      },
      {
        aisheCode: 'U-10023',
        name: 'Visvesvaraya Technological University',
        type: 'University',
        address: { street: 'Jnana Sangama', city: 'Belagavi', district: 'Belagavi', state: 'Karnataka', pincode: '590018' },
        phone: '0831-2498100',
        email: 'registrar@vtu.ac.in',
        website: 'www.vtu.ac.in',
        principalName: 'Prof. S. Vidyashankar',
        establishedYear: 1998,
        nirf: { rank: 48, year: 2024, teachingScore: 85.3, researchScore: 79.6, overallScore: 82.4 },
        accreditation: { naaacGrade: 'A+', naaacScore: 3.42, nbaAccredited: true },
        stats: { totalStudents: 310000, totalFaculty: 12000, studentFacultyRatio: 25.8, placementRate: 82 },
        compliance: { ugcApproved: true, aicteApproved: true, complianceStatus: 'compliant' },
        managedBy: adminUser._id,
      },
      {
        aisheCode: 'C-31456',
        name: 'RV College of Engineering',
        type: 'Autonomous College',
        address: { street: 'Tech Park Road', city: 'Demo City', district: 'Demo District', state: 'Demo State', pincode: '560002' },
        phone: '080-67178000',
        email: 'principal@rvce.edu.in',
        website: 'www.rvce.edu.in',
        principalName: 'Dr. K.N. Subramanya',
        establishedYear: 1963,
        nirf: { rank: 89, year: 2024, teachingScore: 81.2, researchScore: 74.8, overallScore: 78.5 },
        accreditation: { naaacGrade: 'A+', naaacScore: 3.67, nbaAccredited: true },
        stats: { totalStudents: 5200, totalFaculty: 290, studentFacultyRatio: 17.9, placementRate: 92 },
        compliance: { ugcApproved: true, aicteApproved: true, complianceStatus: 'compliant' },
        managedBy: adminUser._id,
      },
      {
        aisheCode: 'C-28901',
        name: 'M.S. Ramaiah Institute of Technology',
        type: 'Autonomous College',
        address: { street: 'Innovation Campus', city: 'Demo City', district: 'Demo District', state: 'Demo State', pincode: '560003' },
        phone: '080-23600822',
        email: 'info@msrit.edu',
        website: 'www.msrit.edu',
        principalName: 'Dr. N.V.R. Naidu',
        establishedYear: 1962,
        nirf: { rank: 101, year: 2024, teachingScore: 79.4, researchScore: 71.3, overallScore: 75.8 },
        accreditation: { naaacGrade: 'A', naaacScore: 3.28, nbaAccredited: true },
        stats: { totalStudents: 6800, totalFaculty: 350, studentFacultyRatio: 19.4, placementRate: 89 },
        compliance: { ugcApproved: true, aicteApproved: true, complianceStatus: 'compliant' },
        managedBy: adminUser._id,
      },
      {
        aisheCode: 'C-52341',
        name: 'KPCET - KLE Polytechnic College',
        type: 'Affiliated College',
        address: { street: 'Education Hub', city: 'Demo City', district: 'Demo District', state: 'Demo State', pincode: '560004' },
        phone: '0836-2212063',
        email: 'principal@kpcet.ac.in',
        website: 'www.kpcet.ac.in',
        principalName: 'Dr. Anand Kulkarni',
        establishedYear: 1990,
        nirf: { rank: 210, year: 2024, teachingScore: 68.1, researchScore: 52.4, overallScore: 61.2 },
        accreditation: { naaacGrade: 'B++', naaacScore: 2.89, nbaAccredited: false },
        stats: { totalStudents: 1800, totalFaculty: 95, studentFacultyRatio: 18.9, placementRate: 74 },
        compliance: { ugcApproved: true, aicteApproved: true, complianceStatus: 'compliant' },
        managedBy: adminUser._id,
      },
    ];

    const createdInstitutions = await Institution.create(institutionsData);
    console.log(`🏛️  Created ${createdInstitutions.length} institutions`);
    const mainInstitution = createdInstitutions[0];

    // ── 3. Create Faculty ─────────────────────────────────────────
    const facultyData = [
      {
        user: facultyUsers[0]._id,
        aparId: 'APAR-KA-2024-001',
        employeeId: 'DRAIT-FAC-001',
        department: 'Master of Computer Applications',
        designation: 'Professor',
        specialization: ['Machine Learning', 'Data Science', 'AI'],
        qualifications: [{ degree: 'Ph.D', field: 'Computer Science', institution: 'Demo Research Institute', year: 2008 }],
        experience: { teaching: 18, industry: 3, research: 12 },
        joiningDate: new Date('2006-07-15'),
        institution: mainInstitution._id,
        performance: { teachingScore: 92, researchScore: 88, overallAPARScore: 90, appraisalYear: 2024 },
        publications: [
          { title: 'Deep Learning for Educational Analytics', journal: 'IEEE Access', year: 2023, impactFactor: 3.9, type: 'journal' },
          { title: 'AI in Institutional Performance Monitoring', journal: 'Springer LNCS', year: 2022, impactFactor: 2.1, type: 'conference' },
        ],
        status: 'active',
      },
      {
        user: facultyUsers[1]._id,
        aparId: 'APAR-KA-2024-002',
        employeeId: 'DRAIT-FAC-002',
        department: 'Computer Science & Engineering',
        designation: 'Associate Professor',
        specialization: ['Cloud Computing', 'Distributed Systems'],
        qualifications: [{ degree: 'Ph.D', field: 'Information Technology', institution: 'VTU', year: 2014 }],
        experience: { teaching: 12, industry: 5, research: 8 },
        joiningDate: new Date('2012-08-01'),
        institution: mainInstitution._id,
        performance: { teachingScore: 85, researchScore: 72, overallAPARScore: 79, appraisalYear: 2024 },
        publications: [
          { title: 'Scalable Cloud Architecture for EdTech', journal: 'Elsevier', year: 2023, impactFactor: 4.2, type: 'journal' },
        ],
        status: 'active',
      },
      {
        user: facultyUsers[2]._id,
        aparId: 'APAR-KA-2024-003',
        employeeId: 'DRAIT-FAC-003',
        department: 'Master of Computer Applications',
        designation: 'HOD',
        specialization: ['Database Systems', 'Software Engineering', 'MERN Stack'],
        qualifications: [{ degree: 'Ph.D', field: 'Computer Applications', institution: 'Mysore University', year: 2010 }],
        experience: { teaching: 20, industry: 2, research: 15 },
        joiningDate: new Date('2004-06-01'),
        institution: mainInstitution._id,
        performance: { teachingScore: 95, researchScore: 82, overallAPARScore: 89, appraisalYear: 2024 },
        publications: [
          { title: 'Unified Data Management for Higher Education', journal: 'ACM Digital Library', year: 2024, impactFactor: 3.5, type: 'journal' },
        ],
        status: 'active',
      },
    ];

    const createdFaculty = await Faculty.create(facultyData);
    console.log(`👨‍🏫 Created ${createdFaculty.length} faculty members`);

    // ── 4. Create Students ────────────────────────────────────────
    const studentsData = [
      {
        user: studentUsers[0]._id,
        aadharNumber: '123456789012',
        usn: '1DA23CS027',
        department: 'Computer Science & Engineering',
        program: 'B.E',
        batch: '2023-2027',
        admissionYear: 2023,
        currentSemester: 4,
        institution: mainInstitution._id,
        status: 'active',
        attendance: { percentage: 82, totalClasses: 180, attendedClasses: 148 },
        academicRecords: [
          { semester: 1, year: 2023, sgpa: 8.4, cgpa: 8.4, backlogs: 0 },
          { semester: 2, year: 2024, sgpa: 8.7, cgpa: 8.55, backlogs: 0 },
          { semester: 3, year: 2024, sgpa: 8.2, cgpa: 8.43, backlogs: 0 },
        ],
        governmentSchemes: [{ schemeName: 'Post Matric Scholarship', schemeId: 'PMS-2023-4521', benefitAmount: 25000, status: 'active' }],
      },
      {
        user: studentUsers[1]._id,
        aadharNumber: '234567890123',
        usn: '20242MCA0268',
        department: 'Master of Computer Applications',
        program: 'MCA',
        batch: '2024-2026',
        admissionYear: 2024,
        currentSemester: 2,
        institution: mainInstitution._id,
        status: 'active',
        attendance: { percentage: 91, totalClasses: 160, attendedClasses: 146 },
        academicRecords: [
          { semester: 1, year: 2024, sgpa: 9.1, cgpa: 9.1, backlogs: 0 },
        ],
      },
      {
        user: studentUsers[2]._id,
        aadharNumber: '345678901234',
        usn: '20242MCA0283',
        department: 'Master of Computer Applications',
        program: 'MCA',
        batch: '2024-2026',
        admissionYear: 2024,
        currentSemester: 2,
        institution: mainInstitution._id,
        status: 'active',
        attendance: { percentage: 78, totalClasses: 160, attendedClasses: 125 },
        academicRecords: [
          { semester: 1, year: 2024, sgpa: 7.8, cgpa: 7.8, backlogs: 1 },
        ],
      },
      {
        user: studentUsers[3]._id,
        aadharNumber: '456789012345',
        usn: '1DA21CS089',
        department: 'Computer Science & Engineering',
        program: 'B.E',
        batch: '2021-2025',
        admissionYear: 2021,
        currentSemester: 8,
        institution: mainInstitution._id,
        status: 'active',
        attendance: { percentage: 88, totalClasses: 200, attendedClasses: 176 },
        academicRecords: [
          { semester: 1, year: 2021, sgpa: 8.9, cgpa: 8.9, backlogs: 0 },
          { semester: 2, year: 2022, sgpa: 9.2, cgpa: 9.05, backlogs: 0 },
          { semester: 3, year: 2022, sgpa: 8.8, cgpa: 8.97, backlogs: 0 },
          { semester: 4, year: 2023, sgpa: 9.0, cgpa: 8.98, backlogs: 0 },
          { semester: 5, year: 2023, sgpa: 9.3, cgpa: 9.04, backlogs: 0 },
          { semester: 6, year: 2024, sgpa: 9.1, cgpa: 9.05, backlogs: 0 },
          { semester: 7, year: 2024, sgpa: 8.7, cgpa: 9.0, backlogs: 0 },
        ],
        placement: { isPlaced: true, company: 'Infosys', package: 4.5, joiningDate: new Date('2025-07-01'), role: 'Systems Engineer' },
        governmentSchemes: [{ schemeName: 'Merit Scholarship', schemeId: 'MS-2021-1123', benefitAmount: 40000, status: 'completed' }],
      },
      {
        user: studentUsers[4]._id,
        aadharNumber: '567890123456',
        usn: '1DA21CS042',
        department: 'Computer Science & Engineering',
        program: 'B.E',
        batch: '2021-2025',
        admissionYear: 2021,
        currentSemester: 8,
        institution: mainInstitution._id,
        status: 'active',
        attendance: { percentage: 74, totalClasses: 200, attendedClasses: 148 },
        academicRecords: [
          { semester: 1, year: 2021, sgpa: 7.2, cgpa: 7.2, backlogs: 1 },
          { semester: 2, year: 2022, sgpa: 7.8, cgpa: 7.5, backlogs: 0 },
          { semester: 3, year: 2022, sgpa: 8.1, cgpa: 7.7, backlogs: 0 },
          { semester: 4, year: 2023, sgpa: 8.4, cgpa: 7.88, backlogs: 0 },
        ],
        placement: { isPlaced: true, company: 'Wipro', package: 3.5, joiningDate: new Date('2025-08-01'), role: 'Associate Software Engineer' },
      },
    ];

    const createdStudents = await Student.create(studentsData);
    console.log(`👨‍🎓 Created ${createdStudents.length} students`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SEED COMPLETE! Demo data ready.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin   → admin@educare.com   / admin123');
    console.log('   Faculty → rajesh@educare.com  / faculty123');
    console.log('   Student → bhanu@educare.com   / student123');
    console.log('   Student → manu@educare.com    / student123');
    console.log('\n📊 Data Created:');
    console.log(`   🏛️  ${createdInstitutions.length} Institutions`);
    console.log(`   👨‍🏫 ${createdFaculty.length} Faculty Members`);
    console.log(`   👨‍🎓 ${createdStudents.length} Students`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
