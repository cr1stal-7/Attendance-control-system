package com.example.attendance.controller;

import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/staff/faculty")
public class StaffFacultyController {

    private final EmployeeRepository employeeRepository;

    public StaffFacultyController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, String>> getFacultyInfo(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (employee.isEmpty() || employee.get().getDepartment() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Map.of("name", employee.get().getDepartment().getName()));
    }
}