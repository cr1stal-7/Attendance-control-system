import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Welcome from './components/Welcome';
import AdminDashboard from './components/AdminDashboard';
import TeacherLayout from './components/teacher/TeacherLayout';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import TeacherAttendance from './components/teacher/TeacherAttendance';
import TeacherSettings from './components/teacher/TeacherSettings';
import TeacherStatistics from './components/teacher/TeacherStatistics';
import StaffDashboard from './components/StaffDashboard';
import StudentLayout from './components/student/StudentLayout';
import StudentDashboard from './components/student/StudentDashboard';
import StudentAttendance from './components/student/StudentAttendance';
import StudentSettings from './components/student/StudentSettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="settings" element={<TeacherSettings />} />
           <Route path="statistics" element={<TeacherStatistics />} />
          <Route index element={<TeacherDashboard />} />
        </Route>
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="settings" element={<StudentSettings />} />
          <Route index element={<StudentDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
