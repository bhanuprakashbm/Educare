# EduCare - Unified Educational Data Management Platform

A comprehensive MERN stack application for managing educational institutions, student data, faculty performance, and institutional analytics.

## Features

### Core Modules
- **Student Management**: Academic records, attendance tracking, government schemes
- **Faculty Management**: APAR tracking, performance evaluation, research analytics
- **Institution Management**: AISHE compliance, NIRF rankings, NAAC accreditation
- **Analytics Dashboard**: Comprehensive insights and reporting

### Key Features
- Role-based access control (Admin, Faculty, Student)
- JWT authentication
- Real-time analytics with Recharts
- NIRF Score Calculator
- Government Schemes Tracker
- Academic Record Management
- Search and Filter functionality

## Tech Stack

### Frontend
- React.js
- React Router
- Bootstrap 5
- Recharts (Analytics)
- Axios (API calls)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt.js

### AI Integration
- Google Gemini AI for analytics and predictions

## Project Structure

```
educare/
|
|__ src/
|   |__ context/
|   |   |__ AuthContext.js
|   |__ services/
|   |   |__ api.js
|   |__ components/
|   |   |__ Navbar.js
|   |   |__ PrivateRoute.js
|   |   |__ StatCard.js
|   |__ pages/
|       |__ Login.js
|       |__ Register.js
|       |__ LandingPage.js
|       |__ admin/
|       |   |__ AdminDashboard.js
|       |   |__ Students.js
|       |   |__ Faculty.js
|       |   |__ Institutions.js
|       |   |__ Analytics.js
|       |   |__ NIRFCalculator.js
|       |__ faculty/
|       |   |__ FacultyDashboard.js
|       |__ student/
|           |__ StudentDashboard.js
|   |__ App.js
|
|__ server/
    |__ index.js
    |__ config/
    |   |__ db.js
    |__ models/
    |   |__ User.js
    |   |__ Student.js
    |   |__ Faculty.js
    |   |__ Institution.js
    |__ controllers/
    |   |__ authController.js
    |   |__ studentController.js
    |   |__ facultyController.js
    |   |__ institutionController.js
    |   |__ aiController.js
    |__ routes/
    |   |__ authRoutes.js
    |   |__ studentRoutes.js
    |   |__ facultyRoutes.js
    |   |__ institutionRoutes.js
    |   |__ aiRoutes.js
    |__ middleware/
    |   |__ auth.js
    |   |__ errorHandler.js
    |__ seed.js
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/Manu14-BM/Educare.git
cd educare
```

### Step 2: Set up MongoDB Atlas
1. Create a free cluster at [MongoDB Atlas](https://mongodb.com/atlas)
2. Get your connection string
3. Create `server/.env` file with your MongoDB URI

### Step 3: Backend Setup
```bash
cd server
npm install
```

Create `.env` file in server directory:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/educare?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_google_gemini_api_key_from_aistudio
FRONTEND_URL=http://localhost:3000
```

### Step 4: Frontend Setup
```bash
cd ..
npm install
```

### Step 5: Seed Demo Data (Optional)
```bash
cd server
node seed.js
```

## Running the Application

### Start Backend Server
```bash
cd server
npm run dev
```
Server runs at: http://localhost:5000

### Start Frontend
```bash
cd ..
npm start
```
Application runs at: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Faculty
- `GET /api/faculty` - Get all faculty
- `POST /api/faculty` - Create faculty
- `GET /api/faculty/:id` - Get faculty by ID
- `PUT /api/faculty/:id` - Update faculty
- `DELETE /api/faculty/:id` - Delete faculty

### Institutions
- `GET /api/institutions` - Get all institutions
- `POST /api/institutions` - Create institution
- `GET /api/institutions/analytics` - Get platform analytics
- `GET /api/institutions/:id` - Get institution by ID
- `PUT /api/institutions/:id` - Update institution
- `DELETE /api/institutions/:id` - Delete institution

### AI Features
- `POST /api/ai/analyze-report` - Analyze student report
- `POST /api/ai/predict-cgpa` - Predict CGPA trends
- `GET /api/ai/attendance-risk` - Get attendance risk alerts
- `POST /api/ai/performance-card` - Generate performance card
- `POST /api/ai/peer-comparison` - Compare with peers

## Demo Credentials

### Admin
- Email: admin@educare.com
- Password: admin123

### Faculty
- Dr. Rajesh Kumar: rajesh@educare.com / faculty123
- Dr. Priya Sharma: priya@educare.com / faculty123
- Prof. Suresh Rao: suresh@educare.com / faculty123

### Students
- Bhanu Prakash B M: bhanu@educare.com / student123
- Manu B M: manu@educare.com / student123
- Koushik Gowda: koushik@educare.com / student123
- Spoorthi R: spoorthi@educare.com / student123
- Chethan Kumar: chethan@educare.com / student123

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.com/api`

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set root directory: `server`
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env` file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For any queries or support, please reach out to the development team.
