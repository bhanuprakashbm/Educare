import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Students from './pages/admin/Students';
import Faculty from './pages/admin/Faculty';
import Institutions from './pages/admin/Institutions';
import Analytics from './pages/admin/Analytics';
import NIRFCalculator from './pages/admin/NIRFCalculator';
import Search from './pages/admin/Search';

// Faculty pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import AddAcademicRecord from './pages/faculty/AddAcademicRecord';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import GovernmentSchemes from './pages/student/GovernmentSchemes';
import AIReportAnalyzer from './pages/student/AIReportAnalyzer';
import CGPAPredictor from './pages/student/CGPAPredictor';
import AttendanceRisk from './pages/student/AttendanceRisk';
import PerformanceCard from './pages/student/PerformanceCard';
import PeerComparison from './pages/student/PeerComparison';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin routes */}
          <Route path="/admin" element={
            <PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>
          } />
          <Route path="/admin/students" element={
            <PrivateRoute roles={['admin']}><Students /></PrivateRoute>
          } />
          <Route path="/admin/faculty" element={
            <PrivateRoute roles={['admin']}><Faculty /></PrivateRoute>
          } />
          <Route path="/admin/institutions" element={
            <PrivateRoute roles={['admin']}><Institutions /></PrivateRoute>
          } />
          <Route path="/admin/analytics" element={
            <PrivateRoute roles={['admin']}><Analytics /></PrivateRoute>
          } />
          <Route path="/admin/nirf" element={
            <PrivateRoute roles={['admin']}><NIRFCalculator /></PrivateRoute>
          } />
          <Route path="/admin/search" element={
            <PrivateRoute roles={['admin']}><Search /></PrivateRoute>
          } />

          {/* Faculty routes */}
          <Route path="/faculty" element={
            <PrivateRoute roles={['faculty']}><FacultyDashboard /></PrivateRoute>
          } />
          <Route path="/faculty/students" element={
            <PrivateRoute roles={['faculty']}><Students /></PrivateRoute>
          } />
          <Route path="/faculty/add-record" element={
            <PrivateRoute roles={['faculty', 'admin']}><AddAcademicRecord /></PrivateRoute>
          } />

          {/* Student routes */}
          <Route path="/student" element={
            <PrivateRoute roles={['student']}><StudentDashboard /></PrivateRoute>
          } />
          <Route path="/student/schemes" element={
            <PrivateRoute roles={['student']}><GovernmentSchemes /></PrivateRoute>
          } />
          {/* AI-powered student routes — accessible by admin, faculty, student */}
          <Route path="/ai/report-analyzer" element={
            <PrivateRoute roles={['admin', 'faculty', 'student']}><AIReportAnalyzer /></PrivateRoute>
          } />
          <Route path="/ai/cgpa-predictor" element={
            <PrivateRoute roles={['admin', 'faculty']}><CGPAPredictor /></PrivateRoute>
          } />
          <Route path="/ai/attendance-risk" element={
            <PrivateRoute roles={['admin', 'faculty']}><AttendanceRisk /></PrivateRoute>
          } />
          <Route path="/ai/performance-card" element={
            <PrivateRoute roles={['admin', 'faculty']}><PerformanceCard /></PrivateRoute>
          } />
          <Route path="/ai/peer-comparison" element={
            <PrivateRoute roles={['admin', 'faculty']}><PeerComparison /></PrivateRoute>
          } />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
