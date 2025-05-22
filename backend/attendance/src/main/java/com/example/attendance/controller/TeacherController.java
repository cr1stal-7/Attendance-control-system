package com.example.attendance.controller;

import com.example.attendance.dto.*;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import com.example.attendance.service.TeacherService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {
    private final TeacherService teacherService;
    private final EmployeeRepository employeeRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;

    public TeacherController(TeacherService teacherService,
                             EmployeeRepository employeeRepository,
                             StudentRepository studentRepository,
                             AttendanceRepository attendanceRepository) {
        this.teacherService = teacherService;
        this.employeeRepository = employeeRepository;
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @GetMapping("/semesters")
    public ResponseEntity<List<SemesterDTO>> getTeacherSemesters(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            Integer teacherId = getTeacherIdFromUserDetails(userDetails);
            if (teacherId == null) {
                return ResponseEntity.notFound().build();
            }

            List<Semester> semesters = teacherService.getSemestersByTeacher(teacherId);
            return ResponseEntity.ok(semesters.stream()
                    .map(s -> new SemesterDTO(s.getIdSemester(), s.getAcademicYear(), s.getType()))
                    .collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<SubjectDTO>> getSubjectsForSemester(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Integer semesterId
    ) {
        try {
            Integer teacherId = getTeacherIdFromUserDetails(userDetails);
            if (teacherId == null) {
                return ResponseEntity.notFound().build();
            }

            List<Subject> subjects = teacherService.getSubjectsByTeacherAndSemester(teacherId, semesterId);
            return ResponseEntity.ok(subjects.stream()
                    .map(s -> new SubjectDTO(s.getIdSubject(), s.getName()))
                    .collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/groups")
    public ResponseEntity<List<GroupDTO>> getGroupsForSubjectAndSemester(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Integer subjectId,
            @RequestParam Integer semesterId
    ) {
        try {
            Integer teacherId = getTeacherIdFromUserDetails(userDetails);
            if (teacherId == null) {
                return ResponseEntity.notFound().build();
            }

            List<StudentGroup> groups = teacherService.getGroupsByTeacherAndSubjectAndSemester(
                    teacherId, subjectId, semesterId);
            return ResponseEntity.ok(groups.stream()
                    .map(g -> new GroupDTO(g.getIdGroup(), g.getName()))
                    .collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getAttendanceStatistics(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Integer groupId,
            @RequestParam Integer subjectId,
            @RequestParam Integer semesterId
    ) {
        try {
            Integer teacherId = getTeacherIdFromUserDetails(userDetails);
            if (teacherId == null) {
                return ResponseEntity.notFound().build();
            }

            // Проверка что преподаватель ведет этот предмет у этой группы в этом семестре
            if (!teacherService.isTeacherAssignedToGroupSubjectSemester(
                    teacherId, groupId, subjectId, semesterId)) {
                return ResponseEntity.badRequest().build();
            }

            List<Student> students = studentRepository.findByGroupId(groupId);
            if (students.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            List<StudentAttendanceDTO> statistics = students.stream()
                    .map(student -> {
                        List<Attendance> attendances = attendanceRepository
                                .findByStudentAndClassEntity_CurriculumSubject_Subject_IdSubjectAndClassEntity_CurriculumSubject_Semester_IdSemester(
                                        student, subjectId, semesterId);

                        int totalClasses = attendances.size();
                        int missedClasses = (int) attendances.stream()
                                .filter(a -> !a.getPresent())
                                .count();

                        Integer percentage = totalClasses > 0 ?
                                (int) Math.round(100.0 - (missedClasses * 100.0 / totalClasses)) :
                                null;

                        return new StudentAttendanceDTO(
                                student.getIdStudent(),
                                student.getSurname(),
                                student.getName(),
                                student.getSecondName(),
                                totalClasses,
                                missedClasses,
                                percentage
                        );
                    })
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("subjectId", subjectId);
            response.put("semesterId", semesterId);
            response.put("students", statistics);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private Integer getTeacherIdFromUserDetails(UserDetails userDetails) {
        String email = userDetails.getUsername();
        return employeeRepository.findByEmail(email)
                .map(Employee::getIdEmployee)
                .orElse(null);
    }
}