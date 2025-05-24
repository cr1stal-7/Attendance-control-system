package com.example.attendance.controller;

import com.example.attendance.model.*;
import com.example.attendance.repository.AttendanceRepository;
import com.example.attendance.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student/attendance")
public class StudentAttendanceController {
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;

    public StudentAttendanceController(StudentRepository studentRepository,
                                       AttendanceRepository attendanceRepository) {
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @GetMapping("/semesters")
    public ResponseEntity<List<Semester>> getStudentSemesters(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Semester> semesters = studentRepository.findSemestersByStudentEmail(principal.getName());
        return ResponseEntity.ok(semesters);
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getSubjectsForSemester(
            Principal principal,
            @RequestParam Integer semesterId
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Subject> subjects = studentRepository.findSubjectsByStudentAndSemester(
                principal.getName(),
                semesterId
        );
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/general")
    public ResponseEntity<List<Map<String, Object>>> getGeneralAttendance(
            Principal principal,
            @RequestParam Integer semesterId
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Student> student = studentRepository.findByEmail(principal.getName());
        if (student.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Attendance> attendances = attendanceRepository
                .findByStudentAndClassEntity_CurriculumSubject_Semester_IdSemester(
                        student.get(),
                        semesterId
                );

        Map<String, AttendanceStats> statsBySubject = attendances.stream()
                .collect(Collectors.groupingBy(
                        att -> att.getClassEntity().getCurriculumSubject().getSubject().getName(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    AttendanceStats stats = new AttendanceStats();
                                    stats.totalClasses = list.size();
                                    stats.missedClasses = (int) list.stream()
                                            .filter(a -> a.getStatus() != null &&
                                                    ("Отсутствие".equals(a.getStatus().getName()) ||
                                                            "Уважительная причина".equals(a.getStatus().getName())))
                                            .count();
                                    return stats;
                                }
                        )
                ));

        List<Map<String, Object>> response = statsBySubject.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> stat = new HashMap<>();
                    stat.put("subject", entry.getKey());
                    stat.put("totalClasses", entry.getValue().totalClasses);
                    stat.put("missedClasses", entry.getValue().missedClasses);
                    stat.put("attendancePercentage",
                            entry.getValue().totalClasses == 0 ? 0 :
                                    Math.round((1 - (double) entry.getValue().missedClasses /
                                            entry.getValue().totalClasses) * 100));
                    return stat;
                })
                .sorted(Comparator.comparing(m -> (String) m.get("subject")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/details")
    public ResponseEntity<Map<String, Object>> getAttendanceDetails(
            Principal principal,
            @RequestParam String subject,
            @RequestParam Integer semesterId
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Student> student = studentRepository.findByEmail(principal.getName());
        if (student.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Attendance> attendances = attendanceRepository
                .findByStudentAndClassEntity_CurriculumSubject_Subject_NameAndClassEntity_CurriculumSubject_Semester_IdSemester(
                        student.get(),
                        subject,
                        semesterId
                );

        attendances.sort(Comparator.comparing(a -> a.getClassEntity().getDatetime()));

        List<String> dates = attendances.stream()
                .map(a -> a.getClassEntity().getDatetime().toLocalDate().toString())
                .distinct()
                .collect(Collectors.toList());

        Map<String, String> attendanceByDate = attendances.stream()
                .collect(Collectors.toMap(
                        a -> a.getClassEntity().getDatetime().toLocalDate().toString(),
                        a -> a.getStatus() != null ? a.getStatus().getName() : "",
                        (existing, replacement) -> existing
                ));

        // Рассчитываем процент посещаемости
        long totalClasses = dates.size();
        long attendedClasses = attendances.stream()
                .filter(a -> a.getStatus() == null ||
                        !("Отсутствие".equals(a.getStatus().getName()) ||
                                "Уважительная причина".equals(a.getStatus().getName())))
                .count();
        int attendancePercentage = totalClasses == 0 ? 0 :
                (int) Math.round((double) attendedClasses / totalClasses * 100);

        Map<String, Object> response = new HashMap<>();
        response.put("studentName", student.get().getSurname() + " " +
                student.get().getName() + " " + student.get().getSecondName());
        response.put("subject", subject);
        response.put("dates", dates);
        response.put("attendances", dates.stream()
                .map(date -> {
                    Map<String, String> att = new HashMap<>();
                    att.put("date", date);
                    att.put("status", attendanceByDate.getOrDefault(date, ""));
                    return att;
                })
                .collect(Collectors.toList()));
        response.put("attendancePercentage", attendancePercentage);
        response.put("totalClasses", totalClasses);
        response.put("attendedClasses", attendedClasses);
        response.put("missedClasses", totalClasses - attendedClasses);

        return ResponseEntity.ok(response);
    }

    private static class AttendanceStats {
        int totalClasses = 0;
        int missedClasses = 0;
    }
}