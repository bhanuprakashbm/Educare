const { GoogleGenerativeAI } = require('@google/generative-ai');
const Student = require('../models/Student');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Helper: call Gemini with retry on rate limit
const askGemini = async (prompt, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
      if (jsonMatch) return JSON.parse(jsonMatch[1]);
      try { return JSON.parse(text); } catch { return { raw: text }; }
    } catch (err) {
      if (err.message?.includes('429') && i < retries - 1) {
        await new Promise(res => setTimeout(res, 10000));
        continue;
      }
      throw err;
    }
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    AI Academic Report Analyzer
// @route   POST /api/ai/analyze-report
// @access  Private
// ─────────────────────────────────────────────────────────────
const analyzeReport = async (req, res, next) => {
  try {
    const { reportText, studentName, department, program, semester } = req.body;
    if (!reportText) return res.status(400).json({ success: false, message: 'Report text is required' });

    const prompt = `
You are an expert educational data analyst. Analyze the following student academic report and provide a structured JSON analysis.

Student Info:
- Name: ${studentName || 'Unknown'}
- Department: ${department || 'Unknown'}
- Program: ${program || 'Unknown'}
- Semester: ${semester || 'Unknown'}

Report/Data:
${reportText}

Respond ONLY with a JSON object in this exact format:
\`\`\`json
{
  "overallGrade": "A/B/C/D/F",
  "performanceSummary": "2-3 sentence summary of overall performance",
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "riskLevel": "Low/Medium/High",
  "riskFactors": ["factor1", "factor2"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "predictedNextSemesterCGPA": 0.0,
  "careerSuitability": ["field1", "field2", "field3"],
  "scholarshipEligibility": true/false,
  "scholarshipReason": "reason",
  "actionPlan": [
    { "priority": "High", "action": "action description", "timeline": "timeline" },
    { "priority": "Medium", "action": "action description", "timeline": "timeline" }
  ]
}
\`\`\`
`;

    const analysis = await askGemini(prompt);
    res.json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    CGPA Trend Predictor
// @route   POST /api/ai/predict-cgpa
// @access  Private
// ─────────────────────────────────────────────────────────────
const predictCGPA = async (req, res, next) => {
  try {
    const { studentId } = req.body;

    const student = await Student.findById(studentId).populate('user', 'name');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const records = student.academicRecords.sort((a, b) => a.semester - b.semester);
    if (records.length === 0) return res.status(400).json({ success: false, message: 'No academic records found' });

    const recordsSummary = records.map(r => `Semester ${r.semester} (${r.year}): SGPA=${r.sgpa}, CGPA=${r.cgpa}, Backlogs=${r.backlogs}`).join('\n');

    const prompt = `
You are an academic performance prediction expert. Based on the following student's semester-wise academic records, predict their next semester performance.

Student: ${student.user?.name}
Department: ${student.department}
Program: ${student.program}
Attendance: ${student.attendance?.percentage || 0}%
Current Semester: ${student.currentSemester}

Academic History:
${recordsSummary}

Respond ONLY with a JSON object:
\`\`\`json
{
  "predictedSGPA": 0.0,
  "predictedCGPA": 0.0,
  "trend": "Improving/Stable/Declining",
  "confidence": "High/Medium/Low",
  "trendAnalysis": "explanation of the trend in 2 sentences",
  "keyFactors": ["factor1", "factor2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "graduationCGPAPrediction": 0.0,
  "placementReadiness": "Ready/Needs Improvement/At Risk"
}
\`\`\`
`;

    const prediction = await askGemini(prompt);

    // Build chart data
    const chartData = records.map(r => ({ semester: `Sem ${r.semester}`, sgpa: r.sgpa, cgpa: r.cgpa }));
    const nextSem = student.currentSemester + 1;
    chartData.push({ semester: `Sem ${nextSem} (Predicted)`, sgpa: prediction.predictedSGPA, cgpa: prediction.predictedCGPA, predicted: true });

    res.json({ success: true, prediction, chartData, student: { name: student.user?.name, department: student.department } });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Attendance Risk Analysis
// @route   GET /api/ai/attendance-risk
// @access  Private
// ─────────────────────────────────────────────────────────────
const attendanceRisk = async (req, res, next) => {
  try {
    // Get all students with low attendance
    const students = await Student.find({}).populate('user', 'name email');

    const riskStudents = students.filter(s => (s.attendance?.percentage || 0) < 75);
    const normalStudents = students.filter(s => (s.attendance?.percentage || 0) >= 75);

    if (riskStudents.length === 0) {
      return res.json({
        success: true,
        riskStudents: [],
        summary: { total: students.length, atRisk: 0, safe: students.length },
        aiInsights: { message: 'All students have healthy attendance above 75%.' },
      });
    }

    const riskSummary = riskStudents.map(s =>
      `${s.user?.name} (${s.department}, ${s.program}): ${s.attendance?.percentage || 0}% attendance, Sem ${s.currentSemester}`
    ).join('\n');

    const prompt = `
You are a student welfare expert. The following students are at attendance risk (below 75%):

${riskSummary}

Respond ONLY with JSON:
\`\`\`json
{
  "overallRiskAssessment": "brief overall assessment",
  "interventionStrategies": ["strategy1", "strategy2", "strategy3"],
  "individualActions": [
    { "student": "name", "riskLevel": "Critical/High/Medium", "suggestedAction": "specific action" }
  ],
  "preventionTips": ["tip1", "tip2"]
}
\`\`\`
`;

    const aiInsights = await askGemini(prompt);

    const enrichedRiskStudents = riskStudents.map(s => ({
      _id: s._id,
      name: s.user?.name,
      department: s.department,
      program: s.program,
      semester: s.currentSemester,
      attendance: s.attendance?.percentage || 0,
      totalClasses: s.attendance?.totalClasses || 0,
      attendedClasses: s.attendance?.attendedClasses || 0,
      riskLevel: (s.attendance?.percentage || 0) < 60 ? 'Critical' : (s.attendance?.percentage || 0) < 70 ? 'High' : 'Medium',
    }));

    res.json({
      success: true,
      riskStudents: enrichedRiskStudents,
      summary: { total: students.length, atRisk: riskStudents.length, safe: normalStudents.length },
      aiInsights,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Generate Smart Performance Card
// @route   POST /api/ai/performance-card
// @access  Private
// ─────────────────────────────────────────────────────────────
const generatePerformanceCard = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const student = await Student.findById(studentId).populate('user', 'name email').populate('institution', 'name aisheCode');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const records = student.academicRecords.sort((a, b) => a.semester - b.semester);
    const latestRecord = records[records.length - 1];
    const avgSGPA = records.length ? (records.reduce((a, r) => a + r.sgpa, 0) / records.length).toFixed(2) : 0;
    const totalBacklogs = records.reduce((a, r) => a + (r.backlogs || 0), 0);

    const prompt = `
Generate a smart performance card for this student:

Name: ${student.user?.name}
USN: ${student.usn || 'N/A'}
Institution: ${student.institution?.name || 'N/A'}
Department: ${student.department}
Program: ${student.program}
Batch: ${student.batch}
Current Semester: ${student.currentSemester}
Attendance: ${student.attendance?.percentage || 0}%
Average SGPA: ${avgSGPA}
Latest CGPA: ${latestRecord?.cgpa || 'N/A'}
Total Backlogs: ${totalBacklogs}
Placement Status: ${student.placement?.isPlaced ? `Placed at ${student.placement.company} (${student.placement.package} LPA)` : 'Not placed yet'}
Government Schemes: ${student.governmentSchemes?.length || 0} active

Respond ONLY with JSON:
\`\`\`json
{
  "performanceRating": "Excellent/Good/Average/Below Average/Poor",
  "ratingScore": 0,
  "headline": "one line performance headline",
  "summary": "3-4 sentence comprehensive summary",
  "academicStanding": "Top 10%/Top 25%/Average/Below Average",
  "keyHighlights": ["highlight1", "highlight2", "highlight3"],
  "areasOfConcern": ["concern1", "concern2"],
  "careerRecommendations": ["recommendation1", "recommendation2"],
  "nextSteps": ["step1", "step2", "step3"],
  "overallVerdict": "brief encouraging closing statement"
}
\`\`\`
`;

    const aiCard = await askGemini(prompt);

    res.json({
      success: true,
      student: {
        name: student.user?.name,
        email: student.user?.email,
        usn: student.usn,
        institution: student.institution?.name,
        department: student.department,
        program: student.program,
        batch: student.batch,
        semester: student.currentSemester,
        attendance: student.attendance?.percentage || 0,
        avgSGPA,
        latestCGPA: latestRecord?.cgpa || 0,
        totalBacklogs,
        placement: student.placement,
        schemes: student.governmentSchemes?.length || 0,
        records,
      },
      aiCard,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Peer Comparison Analysis
// @route   POST /api/ai/peer-comparison
// @access  Private
// ─────────────────────────────────────────────────────────────
const peerComparison = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const student = await Student.findById(studentId).populate('user', 'name');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Get peers from same department and program
    const peers = await Student.find({
      department: student.department,
      program: student.program,
      _id: { $ne: studentId },
    }).populate('user', 'name');

    const studentAvgSGPA = student.academicRecords.length
      ? (student.academicRecords.reduce((a, r) => a + r.sgpa, 0) / student.academicRecords.length)
      : 0;

    const peerStats = peers.map(p => {
      const avgSGPA = p.academicRecords.length
        ? p.academicRecords.reduce((a, r) => a + r.sgpa, 0) / p.academicRecords.length
        : 0;
      return { name: p.user?.name, avgSGPA: parseFloat(avgSGPA.toFixed(2)), attendance: p.attendance?.percentage || 0 };
    });

    const deptAvgSGPA = peerStats.length
      ? (peerStats.reduce((a, p) => a + p.avgSGPA, 0) / peerStats.length).toFixed(2)
      : 0;
    const topperSGPA = peerStats.length ? Math.max(...peerStats.map(p => p.avgSGPA)) : 0;
    const deptAvgAttendance = peerStats.length
      ? (peerStats.reduce((a, p) => a + p.attendance, 0) / peerStats.length).toFixed(1)
      : 0;

    const rank = peerStats.filter(p => p.avgSGPA > studentAvgSGPA).length + 1;

    const prompt = `
Analyze this student's performance compared to their peers:

Student: ${student.user?.name}
Student Avg SGPA: ${studentAvgSGPA.toFixed(2)}
Student Attendance: ${student.attendance?.percentage || 0}%
Department Avg SGPA: ${deptAvgSGPA}
Department Topper SGPA: ${topperSGPA}
Student Rank: ${rank} out of ${peers.length + 1}

Respond ONLY with JSON:
\`\`\`json
{
  "performanceVsDept": "Above Average/Average/Below Average",
  "gapFromTopper": 0.0,
  "gapFromAverage": 0.0,
  "insight": "2-3 sentence comparison insight",
  "motivationalMessage": "encouraging message",
  "improvementPlan": ["step1", "step2", "step3"]
}
\`\`\`
`;

    const aiInsight = await askGemini(prompt);

    res.json({
      success: true,
      comparison: {
        studentName: student.user?.name,
        studentSGPA: parseFloat(studentAvgSGPA.toFixed(2)),
        studentAttendance: student.attendance?.percentage || 0,
        deptAvgSGPA: parseFloat(deptAvgSGPA),
        topperSGPA,
        deptAvgAttendance: parseFloat(deptAvgAttendance),
        rank,
        totalStudents: peers.length + 1,
        percentile: (((peers.length + 1 - rank) / (peers.length + 1)) * 100).toFixed(0),
      },
      chartData: [
        { name: student.user?.name, sgpa: parseFloat(studentAvgSGPA.toFixed(2)), fill: '#1a237e' },
        { name: 'Dept Average', sgpa: parseFloat(deptAvgSGPA), fill: '#1565c0' },
        { name: 'Dept Topper', sgpa: topperSGPA, fill: '#2e7d32' },
      ],
      aiInsight,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    AI APAR Score Generator
// @route   POST /api/ai/apar-score
// @access  Private (Admin)
// ─────────────────────────────────────────────────────────────
const generateAPARScore = async (req, res, next) => {
  try {
    const {
      name, designation, department, teachingHours, studentsHandled,
      publications, patents, projects, feedbackScore,
      workshopsAttended, workshopsConducted, yearsExperience,
      adminWork, extraCurricular,
    } = req.body;

    const prompt = `
You are an expert evaluator for Academic Performance Appraisal Report (APAR) in Indian higher education institutions.
Evaluate the following faculty profile and generate a comprehensive APAR score based on UGC/AICTE guidelines.

Faculty Details:
- Name: ${name}
- Designation: ${designation}
- Department: ${department}
- Teaching Hours per week: ${teachingHours}
- Students Handled: ${studentsHandled}
- Research Publications: ${publications}
- Patents: ${patents || 0}
- Funded Projects: ${projects || 0}
- Student Feedback Score (out of 10): ${feedbackScore}
- Workshops/FDPs Attended: ${workshopsAttended || 0}
- Workshops/FDPs Conducted: ${workshopsConducted || 0}
- Years of Experience: ${yearsExperience}
- Administrative Work: ${adminWork || 'None'}
- Extra Curricular Contributions: ${extraCurricular || 'None'}

Score each parameter and give an overall APAR score out of 100.
Respond ONLY with JSON:
\`\`\`json
{
  "overallAPARScore": 0,
  "grade": "Outstanding/Very Good/Good/Average/Below Average",
  "parameters": {
    "teachingLearning": { "score": 0, "maxScore": 40, "remarks": "" },
    "research": { "score": 0, "maxScore": 30, "remarks": "" },
    "administration": { "score": 0, "maxScore": 15, "remarks": "" },
    "professionalDevelopment": { "score": 0, "maxScore": 15, "remarks": "" }
  },
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "recommendations": ["rec1", "rec2"],
  "promotionEligibility": true,
  "promotionRemarks": "brief remark on promotion eligibility",
  "summary": "3 sentence professional summary"
}
\`\`\`
`;

    const apariResult = await askGemini(prompt);
    res.json({ success: true, apariResult, faculty: { name, designation, department } });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Research Impact Analyzer
// @route   POST /api/ai/research-impact
// @access  Private (Admin)
// ─────────────────────────────────────────────────────────────
const analyzeResearchImpact = async (req, res, next) => {
  try {
    const { name, department, publications } = req.body;
    if (!publications || publications.length === 0) {
      return res.status(400).json({ success: false, message: 'Publications data required' });
    }

    const pubList = publications.map((p, i) =>
      `${i + 1}. Title: "${p.title}", Journal: ${p.journal}, Year: ${p.year}, Impact Factor: ${p.impactFactor || 'N/A'}, Type: ${p.type}`
    ).join('\n');

    const prompt = `
You are a research impact assessment expert for academic institutions.
Analyze the following research publications of a faculty member and provide a comprehensive impact analysis.

Faculty: ${name}
Department: ${department}
Total Publications: ${publications.length}

Publications:
${pubList}

Respond ONLY with JSON:
\`\`\`json
{
  "overallImpactScore": 0,
  "impactLevel": "High/Medium/Low",
  "hIndexEstimate": 0,
  "totalCitationsEstimate": 0,
  "researchStrengths": ["strength1", "strength2"],
  "topPublications": [
    { "title": "", "reason": "why this is top" }
  ],
  "researchThemes": ["theme1", "theme2"],
  "collaborationSuggestions": ["suggestion1", "suggestion2"],
  "fundingOpportunities": ["opportunity1", "opportunity2"],
  "improvementAreas": ["area1", "area2"],
  "summary": "3 sentence research impact summary"
}
\`\`\`
`;

    const impact = await askGemini(prompt);
    res.json({ success: true, impact, faculty: { name, department, totalPublications: publications.length } });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Faculty Workload Analysis
// @route   GET /api/ai/faculty-workload
// @access  Private (Admin)
// ─────────────────────────────────────────────────────────────
const analyzeFacultyWorkload = async (req, res, next) => {
  try {
    const Faculty = require('../models/Faculty');
    const allFaculty = await Faculty.find({ status: 'active' }).populate('user', 'name');

    const workloadData = allFaculty.map(f => ({
      id: f._id,
      name: f.user?.name || 'Unknown',
      designation: f.designation,
      department: f.department,
      teachingExp: f.experience?.teaching || 0,
      publications: f.publications?.length || 0,
      subjects: f.subjectsTaught?.length || 0,
      aparScore: f.performance?.overallAPARScore || 0,
      teachingScore: f.performance?.teachingScore || 0,
      researchScore: f.performance?.researchScore || 0,
    }));

    const summary = workloadData.map(f =>
      `${f.name} (${f.designation}, ${f.department}): ${f.subjects} subjects, ${f.publications} publications, APAR Score: ${f.aparScore}`
    ).join('\n');

    const prompt = `
Analyze the workload distribution among the following faculty members and identify imbalances, overloaded faculty, and optimization opportunities.

Faculty Workload Data:
${summary}

Total Faculty: ${workloadData.length}

Respond ONLY with JSON:
\`\`\`json
{
  "overallAssessment": "brief overall workload assessment",
  "overloadedFaculty": ["name1", "name2"],
  "underutilizedFaculty": ["name1"],
  "workloadBalance": "Well Balanced/Moderately Balanced/Imbalanced",
  "departmentInsights": [
    { "department": "", "insight": "" }
  ],
  "redistributionSuggestions": ["suggestion1", "suggestion2"],
  "hiringRecommendations": ["recommendation1"],
  "optimizationTips": ["tip1", "tip2", "tip3"]
}
\`\`\`
`;

    const aiInsights = await askGemini(prompt);

    // Build chart data
    const chartData = workloadData.map(f => ({
      name: f.name.split(' ')[0],
      fullName: f.name,
      aparScore: f.aparScore,
      publications: f.publications,
      subjects: f.subjects,
      designation: f.designation,
      department: f.department,
    }));

    const deptWorkload = workloadData.reduce((acc, f) => {
      if (!acc[f.department]) acc[f.department] = { count: 0, avgApar: 0, totalPublications: 0 };
      acc[f.department].count++;
      acc[f.department].avgApar += f.aparScore;
      acc[f.department].totalPublications += f.publications;
      return acc;
    }, {});

    const deptChartData = Object.entries(deptWorkload).map(([dept, data]) => ({
      department: dept.length > 15 ? dept.slice(0, 15) + '...' : dept,
      fullDept: dept,
      faculty: data.count,
      avgApar: data.count ? parseFloat((data.avgApar / data.count).toFixed(1)) : 0,
      publications: data.totalPublications,
    }));

    res.json({ success: true, workloadData: chartData, deptChartData, aiInsights, totalFaculty: allFaculty.length });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeReport, predictCGPA, attendanceRisk, generatePerformanceCard, peerComparison,
  generateAPARScore, analyzeResearchImpact, analyzeFacultyWorkload,
};
