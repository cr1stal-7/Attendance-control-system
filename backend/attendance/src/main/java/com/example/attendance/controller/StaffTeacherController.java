package com.example.attendance.controller;

import com.example.attendance.dto.EmployeeManagementDTO;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff/teachers")
public class StaffTeacherController {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final RoleRepository roleRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffTeacherController(EmployeeRepository employeeRepository,
                                  DepartmentRepository departmentRepository,
                                  PositionRepository positionRepository,
                                  RoleRepository roleRepository,
                                  StudentRepository studentRepository,
                                  PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.positionRepository = positionRepository;
        this.roleRepository = roleRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<EmployeeManagementDTO>> getAllEmployees(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> currentEmployee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (currentEmployee.isEmpty() || currentEmployee.get().getDepartment() == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Department> departments = departmentRepository
                .findByParentDepartment_IdDepartmentOrIdDepartment(
                        currentEmployee.get().getDepartment().getIdDepartment(),
                        currentEmployee.get().getDepartment().getIdDepartment());

        List<Employee> employees = employeeRepository
                .findByDepartmentInAndRole_NameNot(departments, "Администратор");

        List<EmployeeManagementDTO> employeeDTOs = employees.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(employeeDTOs);
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getFacultyAndSubdepartments(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> currentEmployee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (currentEmployee.isEmpty() || currentEmployee.get().getDepartment() == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Department> departments = departmentRepository
                .findByParentDepartment_IdDepartmentOrIdDepartment(
                        currentEmployee.get().getDepartment().getIdDepartment(),
                        currentEmployee.get().getDepartment().getIdDepartment());

        return ResponseEntity.ok(departments);
    }

    @GetMapping("/positions")
    public ResponseEntity<List<Position>> getAvailablePositions() {
        return ResponseEntity.ok(positionRepository.findAll());
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAvailableRoles() {
        return ResponseEntity.ok(roleRepository.findByNameNot("Администратор"));
    }

    @PostMapping
    public ResponseEntity<?> createEmployee(
            @RequestBody EmployeeManagementDTO employeeDTO,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> currentEmployee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (currentEmployee.isEmpty() ||
                employeeDTO.getSurname() == null || employeeDTO.getName() == null ||
                employeeDTO.getBirthDate() == null || employeeDTO.getEmail() == null ||
                employeeDTO.getPassword() == null || employeeDTO.getIdPosition() == null ||
                employeeDTO.getIdRole() == null || employeeDTO.getIdDepartment() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (employeeRepository.existsByEmail(employeeDTO.getEmail()) ||
                studentRepository.existsByEmail(employeeDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("message","Email уже используется"));
        }

        Optional<Role> roleOpt = roleRepository.findById(employeeDTO.getIdRole());
        if (roleOpt.isEmpty() || "Администратор".equals(roleOpt.get().getName())) {
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
                .filter(r -> !"Администратор".equals(r.getName()))
                .ifPresent(employee::setRole);

        Employee savedEmployee = employeeRepository.save(employee);
        return ResponseEntity.ok(mapToDTO(savedEmployee));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable Integer id,
            @RequestBody EmployeeManagementDTO employeeDTO,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> currentEmployee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (currentEmployee.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Employee> employeeOpt = employeeRepository.findById(id);
        if (employeeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Employee employee = employeeOpt.get();

        if (employeeDTO.getEmail() != null && !employeeDTO.getEmail().equals(employee.getEmail())) {
            if (employeeRepository.existsByEmail(employeeDTO.getEmail()) ||
                    studentRepository.existsByEmail(employeeDTO.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of("message","Email уже используется"));
            }
        }

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
                    .filter(r -> !"Администратор".equals(r.getName()))
                    .ifPresent(employee::setRole);
        }

        Employee updatedEmployee = employeeRepository.save(employee);
        return ResponseEntity.ok(mapToDTO(updatedEmployee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(
            @PathVariable Integer id,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> currentEmployee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (currentEmployee.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Employee> employeeOpt = employeeRepository.findById(id);
        if (employeeOpt.isEmpty()) {
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