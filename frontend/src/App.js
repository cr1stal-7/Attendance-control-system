import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import EducationFormManagement from "./components/admin/EducationFormManagement";
import BuildingManagement from "./components/admin/BuildingManagement";
import PositionManagement from "./components/admin/PositionManagement";
import SemesterManagement from "./components/admin/SemesterManagement";
import SubjectManagement from "./components/admin/SubjectManagement";
import AttendanceStatusManagement from "./components/admin/AttendanceStatusManagement";
import ClassTypeManagement from "./components/admin/ClassTypeManagement";
import ClassroomManagement from "./components/admin/ClassroomManagement";
import ControlPointManagement from "./components/admin/ControlPointManagement";
import DepartmentManagement from "./components/admin/DepartmentManagement";
import CurriculumManagement from "./components/admin/CurriculumManagement";
import CurriculumSubjectsManagement from "./components/admin/CurriculumSubjectsManagement";
import GroupManagement from "./components/admin/GroupManagement";
import StudentManagement from "./components/admin/StudentManagement";
import EmployeeManagement from "./components/admin/EmployeeManagement";
import AcademicClassesManagement from "./components/admin/AcademicClassesManagement";
import StaffAcademicClassesManagement from "./components/staff/StaffAcademicClassManagement";
import ProtectedRoute from './ProtectedRoute';
import axios from "axios";

axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 403) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
);

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Администратор']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminWelcome />} />
            <Route path="accounts/students" element={<StudentManagement />} />
            <Route path="accounts/employees" element={<EmployeeManagement />} />
            <Route path="accounts/roles" element={<RoleManagement />} />
            <Route path="education/specializations" element={<SpecializationManagement />} />
            <Route path="education/study-forms" element={<EducationFormManagement />} />
            <Route path="education/curriculums" element={<CurriculumManagement />} />
            <Route path="education/curriculum-subjects" element={<CurriculumSubjectsManagement />} />
            <Route path="education/groups" element={<GroupManagement />} />
            <Route path="education/semesters" element={<SemesterManagement />} />
            <Route path="education/subjects" element={<SubjectManagement />} />
            <Route path="structure/departments" element={<DepartmentManagement />} />
            <Route path="structure/buildings" element={<BuildingManagement />} />
            <Route path="structure/classrooms" element={<ClassroomManagement />} />
            <Route path="structure/positions" element={<PositionManagement />} />
            <Route path="attendance/statuses" element={<AttendanceStatusManagement />} />
            <Route path="attendance/control-points" element={<ControlPointManagement />} />
            <Route path="schedule/classes" element={<AcademicClassesManagement />} />
            <Route path="schedule/class-types" element={<ClassTypeManagement />} />
            <Route index element={<AdminWelcome />} />
          </Route>

          <Route path="/staff" element={
            <ProtectedRoute allowedRoles={['Сотрудник']}>
              <StaffLayout />
            </ProtectedRoute>
          }>
            <Route path="reports" element={<StaffReports />} />
            <Route path="add-users" element={<StaffAddUsers />} />
            <Route path="add-classes" element={<StaffAcademicClassesManagement />} />
            <Route path="settings" element={<StaffSettings />} />
            <Route path="long-absence" element={<StaffLongAbsence />} />
            <Route index element={<StaffReports />} />
          </Route>

          <Route path="/teacher" element={
            <ProtectedRoute allowedRoles={['Преподаватель']}>
              <TeacherLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="attendance/:classId" element={<AttendanceForm />} />
            <Route path="settings" element={<TeacherSettings />} />
            <Route path="statistics" element={<TeacherStatistics />} />
            <Route index element={<TeacherDashboard />} />
          </Route>

          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['Студент']}>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="settings" element={<StudentSettings />} />
            <Route index element={<StudentDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;