import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Welcome from './components/Welcome';
import TeacherLayout from './components/teacher/TeacherLayout';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import TeacherAttendance from './components/teacher/TeacherAttendance';
import TeacherSettings from './components/teacher/TeacherSettings';
import TeacherStatistics from './components/teacher/TeacherStatistics';
import AttendanceForm from './components/teacher/AttendanceForm';
import StaffLayout from './components/staff/StaffLayout';
import StaffReports from './components/staff/StaffReports';
import StaffAddUsers from './components/staff/StaffAddUsers';
import StaffAddClasses from './components/staff/StaffAddClasses';
import StaffSettings from './components/staff/StaffSettings';
import StaffLongAbsence from './components/staff/StaffLongAbsence';
import StudentLayout from './components/student/StudentLayout';
import StudentDashboard from './components/student/StudentDashboard';
import StudentAttendance from './components/student/StudentAttendance';
import StudentSettings from './components/student/StudentSettings';
import AdminLayout from './components/admin/AdminLayout';
import AdminWelcome from './components/admin/AdminWelcome';
import SpecializationManagement from "./components/admin/SpecializationManagement";
import RoleManagement from "./components/admin/RoleManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminWelcome />} />
          <Route path="accounts/roles" element={<RoleManagement />} />
          <Route path="education/specializations" element={<SpecializationManagement />} />
          <Route index element={<AdminWelcome />} />
        </Route>
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="reports" element={<StaffReports />} />
          <Route path="add-users" element={<StaffAddUsers />} />
          <Route path="add-classes" element={<StaffAddClasses />} />
          <Route path="settings" element={<StaffSettings />} />
          <Route path="long-absence" element={<StaffLongAbsence />} />
          <Route index element={<StaffReports />} />
        </Route>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="attendance/:classId" element={<AttendanceForm />} />
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
