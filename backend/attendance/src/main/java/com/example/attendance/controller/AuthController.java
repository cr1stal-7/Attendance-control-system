package com.example.attendance.controller;

import com.example.attendance.model.Employee;
import com.example.attendance.model.Student;
import com.example.attendance.repository.EmployeeRepository;
import com.example.attendance.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final StudentRepository studentRepository;
    private final EmployeeRepository employeeRepository;

    public AuthController(StudentRepository studentRepository, EmployeeRepository employeeRepository) {
        this.studentRepository = studentRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Map<String, Object> response = new HashMap<>();

        Optional<Student> student = studentRepository.findByEmail(principal.getName());
        if (student.isPresent()) {
            response.put("type", "student");
            response.put("email", student.get().getEmail());
            response.put("name", student.get().getName());
            return ResponseEntity.ok(response);
        }

        Optional<Employee> employee = employeeRepository.findByEmail(principal.getName());
        if (employee.isPresent()) {
            response.put("type", "employee");
            response.put("email", employee.get().getEmail());
            response.put("name", employee.get().getName());
            response.put("role", employee.get().getRole().getName());
            response.put("position", employee.get().getPosition().getName());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}