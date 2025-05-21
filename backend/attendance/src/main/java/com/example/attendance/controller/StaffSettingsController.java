package com.example.attendance.controller;

import com.example.attendance.dto.EmployeeSettingsDTO;
import com.example.attendance.model.Employee;
import com.example.attendance.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/staff/settings")
public class StaffSettingsController {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffSettingsController(EmployeeRepository employeeRepository,
                                     PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<EmployeeSettingsDTO> getStaffInfo(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (employee.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Employee employeeEntity = employee.get();
        EmployeeSettingsDTO response = new EmployeeSettingsDTO();

        response.setSurname(employeeEntity.getSurname());
        response.setName(employeeEntity.getName());
        response.setSecondName(employeeEntity.getSecondName());
        response.setEmail(employeeEntity.getEmail());
        response.setPosition(employeeEntity.getPosition() != null ?
                employeeEntity.getPosition().getName() : "Не указано");

        if (employeeEntity.getDepartment() != null) {
            response.setDepartment(employeeEntity.getDepartment().getName());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestBody Map<String, String> request,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String newPassword = request.get("newPassword");
        String confirmPassword = request.get("confirmPassword");

        if (newPassword == null || confirmPassword == null ||
                !newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Пароли не совпадают"));
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "Пароль должен содержать не менее 6 символов"));
        }

        Optional<Employee> employee = employeeRepository.findByEmail(principal.getName());
        if (employee.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Employee employeeEntity = employee.get();
        employeeEntity.setPassword(passwordEncoder.encode(newPassword));
        employeeRepository.save(employeeEntity);

        return ResponseEntity.ok(Map.of("message", "Пароль успешно изменен"));
    }
}
