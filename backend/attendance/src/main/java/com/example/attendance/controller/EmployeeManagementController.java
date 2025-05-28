package com.example.attendance.controller;

import com.example.attendance.dto.EmployeeManagementDTO;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/accounts/employees")
public class EmployeeManagementController {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeManagementController(EmployeeRepository employeeRepository,
                                        DepartmentRepository departmentRepository,
                                        PositionRepository positionRepository,
                                        RoleRepository roleRepository,
                                        PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.positionRepository = positionRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<EmployeeManagementDTO>> getAllEmployees(
            @RequestParam(required = false) Integer departmentId) {

        List<Employee> employees;

        if (departmentId != null) {
            employees = employeeRepository.findByDepartment_IdDepartment(departmentId);
        } else {
            employees = employeeRepository.findAll();
        }

        List<EmployeeManagementDTO> employeeDTOs = employees.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(employeeDTOs);
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        List<Department> faculties = departmentRepository.findByParentDepartmentIsNull();
        return ResponseEntity.ok(faculties);
    }

    @GetMapping("/subdepartments")
    public ResponseEntity<List<Department>> getSubdepartmentsByDepartment(
            @RequestParam Integer departmentId) {
        List<Department> subdepartments =
                departmentRepository.findByParentDepartment_IdDepartment(departmentId);
        return ResponseEntity.ok(subdepartments);
    }

    @GetMapping("/positions")
    public ResponseEntity<List<Position>> getAllPositions() {
        return ResponseEntity.ok(positionRepository.findAll());
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<EmployeeManagementDTO> createEmployee(
            @RequestBody EmployeeManagementDTO employeeDTO) {
        if (employeeDTO.getSurname() == null || employeeDTO.getName() == null ||
                employeeDTO.getBirthDate() == null || employeeDTO.getEmail() == null ||
                employeeDTO.getPassword() == null || employeeDTO.getIdDepartment() == null ||
                employeeDTO.getIdPosition() == null || employeeDTO.getIdRole() == null) {
            return ResponseEntity.badRequest().build();
        }

        Employee employee = new Employee();
        employee.setSurname(employeeDTO.getSurname());
        employee.setName(employeeDTO.getName());
        employee.setSecondName(employeeDTO.getSecondName());
        employee.setBirthDate(employeeDTO.getBirthDate());
        employee.setEmail(employeeDTO.getEmail());
        employee.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));

        departmentRepository.findById(employeeDTO.getIdDepartment())
                .ifPresent(employee::setDepartment);
        positionRepository.findById(employeeDTO.getIdPosition())
                .ifPresent(employee::setPosition);
        roleRepository.findById(employeeDTO.getIdRole())
                .ifPresent(employee::setRole);

        Employee savedEmployee = employeeRepository.save(employee);
        return ResponseEntity.ok(mapToDTO(savedEmployee));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeManagementDTO> updateEmployee(
            @PathVariable Integer id,
            @RequestBody EmployeeManagementDTO employeeDTO) {

        Optional<Employee> employeeOpt = employeeRepository.findById(id);
        if (employeeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Employee employee = employeeOpt.get();
        if (employeeDTO.getSurname() != null) {
            employee.setSurname(employeeDTO.getSurname());
        }
        if (employeeDTO.getName() != null) {
            employee.setName(employeeDTO.getName());
        }
        if (employeeDTO.getSecondName() != null) {
            employee.setSecondName(employeeDTO.getSecondName());
        }
        if (employeeDTO.getBirthDate() != null) {
            employee.setBirthDate(employeeDTO.getBirthDate());
        }
        if (employeeDTO.getEmail() != null) {
            employee.setEmail(employeeDTO.getEmail());
        }
        if (employeeDTO.getPassword() != null) {
            employee.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
        }
        if (employeeDTO.getIdDepartment() != null) {
            departmentRepository.findById(employeeDTO.getIdDepartment())
                    .ifPresent(employee::setDepartment);
        }
        if (employeeDTO.getIdPosition() != null) {
            positionRepository.findById(employeeDTO.getIdPosition())
                    .ifPresent(employee::setPosition);
        }
        if (employeeDTO.getIdRole() != null) {
            roleRepository.findById(employeeDTO.getIdRole())
                    .ifPresent(employee::setRole);
        }

        Employee updatedEmployee = employeeRepository.save(employee);
        return ResponseEntity.ok(mapToDTO(updatedEmployee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Integer id) {
        if (!employeeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        employeeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private EmployeeManagementDTO mapToDTO(Employee employee) {
        String departmentName = null;

        if (employee.getDepartment() != null) {
            departmentName = employee.getDepartment().getName();
        }

        return new EmployeeManagementDTO(
                employee.getIdEmployee(),
                employee.getSurname(),
                employee.getName(),
                employee.getSecondName(),
                employee.getBirthDate(),
                employee.getEmail(),
                employee.getPassword(),
                employee.getDepartment() != null ? employee.getDepartment().getIdDepartment() : null,
                departmentName,
                employee.getPosition() != null ? employee.getPosition().getIdPosition() : null,
                employee.getPosition() != null ? employee.getPosition().getName() : null,
                employee.getRole() != null ? employee.getRole().getIdRole() : null,
                employee.getRole() != null ? employee.getRole().getName() : null
        );
    }
}