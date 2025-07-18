package com.example.attendance.controller;

import com.example.attendance.dto.*;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import com.example.attendance.service.RecordAnalyzer;
import com.example.attendance.service.TeacherService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {
    private final TeacherService teacherService;
    private final EmployeeRepository employeeRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final StudentGroupRepository studentGroupRepository;

    public TeacherController(TeacherService teacherService,
                             EmployeeRepository employeeRepository,
                             StudentRepository studentRepository,
                             AttendanceRepository attendanceRepository,
                             StudentGroupRepository studentGroupRepository) {
        this.teacherService = teacherService;
        this.employeeRepository = employeeRepository;
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.studentGroupRepository = studentGroupRepository;
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

            List<Attendance> groupAttendances = attendanceRepository
                    .findByGroupAndSubjectAndSemester(groupId, subjectId, semesterId);

            Map<LocalDate, List<Attendance>> attendancesByDate = groupAttendances.stream()
                    .collect(Collectors.groupingBy(
                            a -> a.getClassEntity().getDatetime().toLocalDate()
                    ));

            List<String> classDates = attendancesByDate.keySet().stream()
                    .sorted()
                    .map(LocalDate::toString)
                    .collect(Collectors.toList());

            List<Map<String, Object>> statistics = students.stream()
                    .map(student -> {
                        List<Attendance> studentAttendances = groupAttendances.stream()
                                .filter(a -> a.getStudent().getIdStudent().equals(student.getIdStudent()))
                                .collect(Collectors.toList());

                        Map<LocalDate, List<Attendance>> studentAttendancesByDate = studentAttendances.stream()
                                .collect(Collectors.groupingBy(
                                        a -> a.getClassEntity().getDatetime().toLocalDate()
                                ));

                        int totalClasses = (int) groupAttendances.stream()
                                .map(a -> a.getClassEntity().getIdClass())
                                .distinct()
                                .count();

                        int attendedClasses = (int) studentAttendances.stream()
                                .filter(a -> a.getStatus() == null ||
                                        !("Отсутствие".equals(a.getStatus().getName()) ||
                                                "Уважительная причина".equals(a.getStatus().getName())))
                                .map(a -> a.getClassEntity().getIdClass())
                                .distinct()
                                .count();

                        int attendancePercentage = totalClasses == 0 ? 0 :
                                (int) Math.round((double) attendedClasses / totalClasses * 100);

                        Map<String, Object> studentStats = new HashMap<>();
                        studentStats.put("studentId", student.getIdStudent());
                        studentStats.put("lastName", student.getSurname());
                        studentStats.put("firstName", student.getName());
                        studentStats.put("middleName", student.getSecondName());
                        studentStats.put("totalClasses", totalClasses);
                        studentStats.put("missedClasses", totalClasses - attendedClasses);
                        studentStats.put("attendancePercentage", attendancePercentage);

                        studentStats.put("attendanceByDate", classDates.stream()
                                .map(dateStr -> {
                                    LocalDate date = LocalDate.parse(dateStr);
                                    List<Attendance> dateAttendances = studentAttendancesByDate.getOrDefault(date, Collections.emptyList());

                                    String statuses = dateAttendances.stream()
                                            .map(a -> {
                                                if (a.getStatus() == null) return "П";
                                                switch (a.getStatus().getName()) {
                                                    case "Отсутствие": return "ОТ";
                                                    case "Уважительная причина": return "УП";
                                                    default: return "П";
                                                }
                                            })
                                            .collect(Collectors.joining(", "));

                                    if (dateAttendances.isEmpty() && attendancesByDate.containsKey(date)) {
                                        int classesCount = (int) attendancesByDate.get(date).stream()
                                                .map(a -> a.getClassEntity().getIdClass())
                                                .distinct()
                                                .count();
                                        statuses = String.join(", ", Collections.nCopies(classesCount, "ОТ"));
                                    }

                                    Map<String, String> att = new HashMap<>();
                                    att.put("date", dateStr);
                                    att.put("status", statuses);
                                    return att;
                                })
                                .collect(Collectors.toList()));

                        return studentStats;
                    })
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("subjectId", subjectId);
            response.put("semesterId", semesterId);
            response.put("classDates", classDates);
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

            List<ClassDTO> result = new ArrayList<>();
            for (AcademicClass c : classes) {
                for (StudentGroup group : c.getGroups()) {
                    result.add(new ClassDTO(
                            c.getIdClass(),
                            c.getDatetime(),
                            c.getClassType() != null ? c.getClassType().getName() : "Не указано",
                            c.getCurriculumSubject().getSubject().getName(),
                            group.getName(),
                            group.getIdGroup()
                    ));
                }
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/attendance/{classId}")
    public ResponseEntity<Map<String, Object>> getAttendanceData(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Integer classId,
            @RequestParam Integer groupId
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
            StudentGroup group = studentGroupRepository.findById(groupId).orElseThrow();

            List<Student> students = studentRepository.findByGroupId(groupId);
            List<Attendance> existingAttendances = attendanceRepository.findByClassEntity(classEntity);

            List<Integer> studentIds = students.stream()
                    .map(Student::getIdStudent)
                    .collect(Collectors.toList());
            List<ControlPointRecord> allRecords = attendanceRepository.findRecordsByStudentsAndDate(
                    studentIds, classEntity.getDatetime()
            );

            Map<Integer, List<ControlPointRecord>> recordsByStudent = allRecords.stream()
                    .collect(Collectors.groupingBy(r -> r.getStudent().getIdStudent()));

            LocalDateTime classStartTime = classEntity.getDatetime();
            LocalDateTime classEndTime = classStartTime.plusHours(1).plusMinutes(30);
            int minAttendanceMinutes = 90;

            Map<Integer, String> attendanceStatusMap = existingAttendances.stream()
                    .collect(Collectors.toMap(
                            a -> a.getStudent().getIdStudent(),
                            a -> {
                                if (a.getStatus() == null) return "Отсутствие";
                                switch (a.getStatus().getIdStatus()) {
                                    case 1: return "Присутствие";
                                    case 2: return "Отсутствие";
                                    case 3: return "Уважительная причина";
                                    default: return "Отсутствие";
                                }
                            }
                    ));

            List<StudentAttendanceFormDTO> studentDTOs = students.stream()
                    .map(student -> {
                        if (attendanceStatusMap.containsKey(student.getIdStudent())) {
                            return new StudentAttendanceFormDTO(
                                    student.getIdStudent(),
                                    student.getSurname(),
                                    student.getName(),
                                    student.getSecondName(),
                                    attendanceStatusMap.get(student.getIdStudent())
                            );
                        }

                        List<ControlPointRecord> studentRecords = recordsByStudent.getOrDefault(
                                student.getIdStudent(), Collections.emptyList());

                        String status = RecordAnalyzer.determineAttendanceStatus(
                                studentRecords,
                                classStartTime,
                                classEndTime,
                                minAttendanceMinutes
                        );

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

    @PostMapping("/attendance")
    public ResponseEntity<Void> saveAttendance(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody List<AttendanceRequestDTO> attendanceRequests
    ) {
        try {
            Integer teacherId = getTeacherIdFromUserDetails(userDetails);
            if (teacherId == null) {
                return ResponseEntity.notFound().build();
            }

            for (AttendanceRequestDTO request : attendanceRequests) {
                if (!teacherService.isClassBelongsToTeacher(request.getClassId(), teacherId)) {
                    return ResponseEntity.badRequest().build();
                }
            }

            teacherService.saveAttendance(attendanceRequests);
            return ResponseEntity.ok().build();
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