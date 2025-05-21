package com.example.attendance.controller;

import com.example.attendance.dto.*;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import com.example.attendance.service.TeacherService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @GetMapping("/subjects")
    public ResponseEntity<List<SubjectDTO>> getTeacherSubjects(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Integer teacherId = getTeacherIdFromUserDetails(userDetails);
            if (teacherId == null) {
                return ResponseEntity.notFound().build();
            }

            List<Subject> subjects = teacherService.getSubjectsByTeacher(teacherId);
            if (subjects.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(subjects.stream()
                    .map(subject -> new SubjectDTO(subject.getIdSubject(), subject.getName()))
                    .collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/subjects/{subjectId}/groups")
    public ResponseEntity<List<GroupDTO>> getGroupsForSubject(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer subjectId) {
        try {
            Integer teacherId = getTeacherIdFromUserDetails(userDetails);
            if (teacherId == null) {
                return ResponseEntity.notFound().build();
            }

            List<StudentGroup> groups = teacherService.getGroupsByTeacherAndSubject(teacherId, subjectId);
            if (groups.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(groups.stream()
                    .map(group -> new GroupDTO(group.getIdGroup(), group.getName()))
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
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            Integer teacherId = getTeacherIdFromUserDetails(userDetails);
            if (teacherId == null) {
                return ResponseEntity.notFound().build();
            }

            List<StudentGroup> teacherGroups = employeeRepository.findGroupsByTeacherAndSubject(teacherId, subjectId);
            if (teacherGroups.stream().noneMatch(g -> g.getIdGroup().equals(groupId))) {
                return ResponseEntity.badRequest().build();
            }

            List<Student> students = studentRepository.findByGroupId(groupId);
            if (students.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

            List<StudentAttendanceDTO> statistics = students.stream()
                    .map(student -> {
                        List<Attendance> attendances = attendanceRepository.findByStudentAndClassEntity_DatetimeBetween(
                                student, startDateTime, endDateTime);

                        List<Attendance> subjectAttendances = attendances.stream()
                                .filter(a -> a.getClassEntity().getCurriculumSubject().getSubject().getIdSubject().equals(subjectId))
                                .collect(Collectors.toList());

                        int totalClasses = subjectAttendances.size();
                        int missedClasses = (int) subjectAttendances.stream()
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