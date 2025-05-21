package com.example.attendance.controller;

import com.example.attendance.model.AcademicClass;
import com.example.attendance.model.Employee;
import com.example.attendance.repository.EmployeeRepository;
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
@RequestMapping("/api/teacher/schedule")
public class TeacherScheduleController {
    private final EmployeeRepository employeeRepository;

    public TeacherScheduleController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/today")
    public ResponseEntity<List<Map<String, Object>>> getScheduleToday(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmail(principal.getName());
        if (employee.isEmpty() || !employee.get().getRole().getName().equals("ROLE_TEACHER")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);

        List<AcademicClass> classes = employee.get().getClasses().stream()
                .filter(c -> c.getDatetime().isAfter(startOfDay) && c.getDatetime().isBefore(endOfDay))
                .sorted(Comparator.comparing(AcademicClass::getDatetime))
                .collect(Collectors.toList());

        List<Map<String, Object>> schedule = classes.stream().map(this::mapClassToDto).collect(Collectors.toList());
        return ResponseEntity.ok(schedule);
    }

    private Map<String, Object> mapClassToDto(AcademicClass c) {
        Map<String, Object> classInfo = new HashMap<>();
        classInfo.put("datetime", c.getDatetime());
        classInfo.put("group", getGroupInfo(c));
        classInfo.put("subjectName", c.getCurriculumSubject() != null && c.getCurriculumSubject().getSubject() != null
                ? c.getCurriculumSubject().getSubject().getName() : "Не указано");
        classInfo.put("classType", c.getClassType() != null ? c.getClassType().getName() : "Не указано");
        classInfo.put("classroom", getClassroomInfo(c));
        return classInfo;
    }

    private String getGroupInfo(AcademicClass c) {
        if (c.getGroups().isEmpty()) return "Не указано";
        return c.getGroups().get(0).getName() +
                (c.getGroups().get(0).getCourse() != null ?
                        " (" + c.getGroups().get(0).getCourse() + " курс)" : "");
    }

    private String getClassroomInfo(AcademicClass c) {
        if (c.getClassroom() == null) return "Не указано";
        return c.getClassroom().getNumber() +
                (c.getClassroom().getBuilding() != null ?
                        " (" + c.getClassroom().getBuilding().getName() + ")" : "");
    }
}