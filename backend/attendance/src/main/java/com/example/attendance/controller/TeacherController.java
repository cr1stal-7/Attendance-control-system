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

    @GetMapping("/classes")
    public ResponseEntity<List<ClassDTO>> getClassesForSubject(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Integer subjectId,
            @RequestParam Integer semesterId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        try {
            Integer teacherId = getTeacherIdFromUserDetails(userDetails);
            if (teacherId == null) {
                return ResponseEntity.notFound().build();
            }

            if (!teacherService.isTeacherAssignedToSubjectSemester(teacherId, subjectId, semesterId)) {
                return ResponseEntity.badRequest().build();
            }

            List<AcademicClass> classes;
            if (date != null) {
                classes = teacherService.getClassesByTeacherSubjectAndDate(teacherId, subjectId, semesterId, date);
            } else {
                classes = teacherService.getClassesByTeacherSubject(teacherId, subjectId, semesterId);
            }

            List<ClassDTO> result = classes.stream()
                    .map(c -> new ClassDTO(
                            c.getIdClass(),
                            c.getDatetime(),
                            c.getClassType() != null ? c.getClassType().getName() : "Не указано",
                            c.getCurriculumSubject().getSubject().getName(),
                            c.getGroups().stream().findFirst().map(StudentGroup::getName).orElse("")
                    ))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/attendance/{classId}")
    public ResponseEntity<Map<String, Object>> getAttendanceData(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer classId
    ) {
        try {
            Integer teacherId = getTeacherIdFromUserDetails(userDetails);
            if (teacherId == null) {
                return ResponseEntity.notFound().build();
            }

            if (!teacherService.isClassBelongsToTeacher(classId, teacherId)) {
                return ResponseEntity.badRequest().build();
            }

            AcademicClass classEntity = teacherService.getClassById(classId);
            StudentGroup group = classEntity.getGroups().stream().findFirst().orElseThrow();

            List<Student> students = studentRepository.findByGroupId(group.getIdGroup());
            List<Attendance> existingAttendances = attendanceRepository.findByClassEntity(classEntity);

            Map<Integer, String> attendanceStatusMap = existingAttendances.stream()
                    .collect(Collectors.toMap(
                            a -> a.getStudent().getIdStudent(),
                            a -> {
                                if (a.getStatus() == null) return "Присутствует";
                                switch (a.getStatus().getIdStatus()) {
                                    case 1: return "Присутствует";
                                    case 2: return "Отсутствует";
                                    case 3: return "Уважительная причина";
                                    default: return "Присутствует";
                                }
                            }
                    ));

            List<StudentAttendanceFormDTO> studentDTOs = students.stream()
                    .map(student -> {
                        String status = attendanceStatusMap.getOrDefault(student.getIdStudent(), "Присутствует");
                        return new StudentAttendanceFormDTO(
                                student.getIdStudent(),
                                student.getSurname(),
                                student.getName(),
                                student.getSecondName(),
                                status
                        );
                    })
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("classInfo", new ClassInfoDTO(
                    classEntity.getIdClass(),
                    classEntity.getDatetime(),
                    classEntity.getClassType() != null ? classEntity.getClassType().getName() : "Не указано",
                    classEntity.getCurriculumSubject().getSubject().getName(),
                    group.getName()
            ));
            response.put("students", studentDTOs);

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