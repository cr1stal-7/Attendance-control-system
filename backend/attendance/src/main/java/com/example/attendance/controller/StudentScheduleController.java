package com.example.attendance.controller;

import com.example.attendance.model.AcademicClass;
import com.example.attendance.model.Student;
import com.example.attendance.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student/schedule")
public class StudentScheduleController {
    private final StudentRepository studentRepository;

    public StudentScheduleController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping("/today")
    public ResponseEntity<List<Map<String, Object>>> getScheduleToday(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Student> student = studentRepository.findByEmail(principal.getName());
        if (student.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);

        List<AcademicClass> classes = student.get().getGroup().getClasses().stream()
                .filter(c -> c.getDatetime().isAfter(startOfDay) && c.getDatetime().isBefore(endOfDay))
                .sorted(Comparator.comparing(AcademicClass::getDatetime))
                .collect(Collectors.toList());

        List<Map<String, Object>> schedule = classes.stream().map(this::mapClassToDto).collect(Collectors.toList());
        return ResponseEntity.ok(schedule);
    }

    private Map<String, Object> mapClassToDto(AcademicClass c) {
        Map<String, Object> classInfo = new HashMap<>();
        classInfo.put("datetime", c.getDatetime());
        classInfo.put("subjectName", c.getCurriculumSubject() != null && c.getCurriculumSubject().getSubject() != null
                ? c.getCurriculumSubject().getSubject().getName() : "Не указано");
        classInfo.put("classType", c.getClassType() != null ? c.getClassType().getName() : "Не указано");
        classInfo.put("classroom", getClassroomInfo(c));
        classInfo.put("teacherName", getTeacherName(c));
        return classInfo;
    }

    private String getClassroomInfo(AcademicClass c) {
        if (c.getClassroom() == null) return "Не указано";
        return c.getClassroom().getNumber() +
                (c.getClassroom().getBuilding() != null ?
                        " (" + c.getClassroom().getBuilding().getName() + ")" : "");
    }

    private String getTeacherName(AcademicClass c) {
        if (c.getEmployee() == null) return "Не указано";
        return String.join(" ",
                c.getEmployee().getSurname(),
                c.getEmployee().getName(),
                c.getEmployee().getSecondName());
    }
}