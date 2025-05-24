package com.example.attendance.service;

import com.example.attendance.dto.AttendanceRequestDTO;
import com.example.attendance.model.*;
import com.example.attendance.repository.AttendanceRepository;
import com.example.attendance.repository.EmployeeRepository;
import com.example.attendance.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TeacherService {
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public TeacherService(EmployeeRepository employeeRepository, AttendanceRepository attendanceRepository, StudentRepository studentRepository) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    public List<Semester> getSemestersByTeacher(Integer teacherId) {
        return employeeRepository.findSemestersByTeacher(teacherId);
    }

    public List<Subject> getSubjectsByTeacherAndSemester(Integer teacherId, Integer semesterId) {
        return employeeRepository.findSubjectsByTeacherAndSemester(teacherId, semesterId);
    }

    public List<StudentGroup> getGroupsByTeacherAndSubjectAndSemester(
            Integer teacherId, Integer subjectId, Integer semesterId) {
        return employeeRepository.findGroupsByTeacherAndSubjectAndSemester(
                teacherId, subjectId, semesterId);
    }

    public boolean isTeacherAssignedToGroupSubjectSemester(
            Integer teacherId, Integer groupId, Integer subjectId, Integer semesterId) {
        return employeeRepository.isTeacherAssignedToGroupSubjectSemester(
                teacherId, groupId, subjectId, semesterId);
    }
    public boolean isTeacherAssignedToSubjectSemester(Integer teacherId, Integer subjectId, Integer semesterId) {
        return employeeRepository.isTeacherAssignedToSubjectSemester(teacherId, subjectId, semesterId);
    }

    public List<AcademicClass> getClassesByTeacherSubject(Integer teacherId, Integer subjectId, Integer semesterId) {
        return employeeRepository.findClassesByTeacherSubject(teacherId, subjectId, semesterId);
    }

    public List<AcademicClass> getClassesByTeacherSubjectAndDate(Integer teacherId, Integer subjectId, Integer semesterId, LocalDate date) {
        return employeeRepository.findClassesByTeacherSubjectAndDate(teacherId, subjectId, semesterId, date);
    }

    public boolean isClassBelongsToTeacher(Integer classId, Integer teacherId) {
        return employeeRepository.isClassBelongsToTeacher(classId, teacherId);
    }

    public AcademicClass getClassById(Integer classId) {
        return employeeRepository.findClassById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));
    }

    public void saveAttendance(List<AttendanceRequestDTO> attendanceRequests) {
        List<Attendance> attendances = new ArrayList<>();

        for (AttendanceRequestDTO request : attendanceRequests) {
            Attendance attendance = attendanceRepository.findByStudentIdAndClassId(request.getStudentId(), request.getClassId())
                    .orElse(new Attendance());

            attendance.setStudent(studentRepository.findById(request.getStudentId()).orElseThrow());
            attendance.setClassEntity(getClassById(request.getClassId()));

            AttendanceStatus status = new AttendanceStatus();
            switch (request.getStatus()) {
                case "Присутствие":
                    status.setIdStatus(1);
                    break;
                case "Отсутствие":
                    status.setIdStatus(2);
                    break;
                case "Уважительная причина":
                    status.setIdStatus(3);
                    break;
                default:
                    status.setIdStatus(2);
            }
            attendance.setStatus(status);
            attendance.setTime(LocalDateTime.now());

            attendances.add(attendance);
        }

        attendanceRepository.saveAll(attendances);
    }
}