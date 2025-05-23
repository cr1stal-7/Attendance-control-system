package com.example.attendance.controller;

import com.example.attendance.dto.*;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff/teachers")
public class StaffTeachersController {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffTeachersController(EmployeeRepository employeeRepository,
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

    @GetMapping("/positions")
    public ResponseEntity<List<PositionDTO>> getAllPositions() {
        List<Position> positions = positionRepository.findAll();
        List<PositionDTO> positionDTOs = positions.stream()
                .map(position -> new PositionDTO(position.getIdPosition(), position.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(positionDTOs);
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getTeachersByDepartment(@RequestParam Integer departmentId) {
        Optional<Department> department = departmentRepository.findById(departmentId);
        if (department.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Employee> teachers = employeeRepository.findByDepartment(department.get());
        List<EmployeeDTO> teacherDTOs = teachers.stream()
                .map(teacher -> new EmployeeDTO(
                        teacher.getIdEmployee(),
                        teacher.getSurname(),
                        teacher.getName(),
                        teacher.getSecondName(),
                        teacher.getBirthDate(),
                        teacher.getEmail(),
                        teacher.getDepartment().getIdDepartment(),
                        teacher.getDepartment().getName(),
                        teacher.getPosition() != null ? teacher.getPosition().getIdPosition() : null,
                        teacher.getPosition() != null ? teacher.getPosition().getName() : null,
                        teacher.getRole() != null ? teacher.getRole().getIdRole() : null
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(teacherDTOs);
    }

    @PostMapping
    public ResponseEntity<EmployeeDTO> createTeacher(@RequestBody EmployeeCreateDTO teacherDTO) {
        try {
            // Валидация обязательных полей
            if (teacherDTO.getSurname() == null || teacherDTO.getName() == null ||
                    teacherDTO.getEmail() == null || teacherDTO.getPassword() == null ||
                    teacherDTO.getDepartmentId() == null || teacherDTO.getPositionId() == null ||
                    teacherDTO.getBirthDate() == null) {
                return ResponseEntity.badRequest().build();
            }

            Optional<Department> department = departmentRepository.findById(teacherDTO.getDepartmentId());
            Optional<Position> position = positionRepository.findById(teacherDTO.getPositionId());
            Optional<Role> role = teacherDTO.getRoleId() != null ?
                    roleRepository.findById(teacherDTO.getRoleId()) : Optional.empty();

            if (department.isEmpty() || position.isEmpty() ||
                    (teacherDTO.getRoleId() != null && role.isEmpty())) {
                return ResponseEntity.badRequest().build();
            }

            if (employeeRepository.existsByEmail(teacherDTO.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
            }

            Employee teacher = new Employee();
            teacher.setSurname(teacherDTO.getSurname());
            teacher.setName(teacherDTO.getName());
            teacher.setSecondName(teacherDTO.getSecondName());
            teacher.setBirthDate(teacherDTO.getBirthDate());
            teacher.setEmail(teacherDTO.getEmail());
            teacher.setPassword(passwordEncoder.encode(teacherDTO.getPassword()));
            teacher.setDepartment(department.get());
            teacher.setPosition(position.get());
            role.ifPresent(teacher::setRole);

            Employee savedTeacher = employeeRepository.save(teacher);

            return ResponseEntity.ok(new EmployeeDTO(
                    savedTeacher.getIdEmployee(),
                    savedTeacher.getSurname(),
                    savedTeacher.getName(),
                    savedTeacher.getSecondName(),
                    savedTeacher.getBirthDate(),
                    savedTeacher.getEmail(),
                    savedTeacher.getDepartment().getIdDepartment(),
                    savedTeacher.getDepartment().getName(),
                    savedTeacher.getPosition().getIdPosition(),
                    savedTeacher.getPosition().getName(),
                    savedTeacher.getRole() != null ? savedTeacher.getRole().getIdRole() : null
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> updateTeacher(
            @PathVariable Integer id,
            @RequestBody EmployeeUpdateDTO teacherDTO) {
        Optional<Employee> teacherOpt = employeeRepository.findById(id);
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Employee teacher = teacherOpt.get();
        if (teacherDTO.getSurname() != null) {
            teacher.setSurname(teacherDTO.getSurname());
        }
        if (teacherDTO.getName() != null) {
            teacher.setName(teacherDTO.getName());
        }
        if (teacherDTO.getSecondName() != null) {
            teacher.setSecondName(teacherDTO.getSecondName());
        }
        if (teacherDTO.getBirthDate() != null) {
            teacher.setBirthDate(teacherDTO.getBirthDate());
        }
        if (teacherDTO.getEmail() != null) {
            teacher.setEmail(teacherDTO.getEmail());
        }
        if (teacherDTO.getPassword() != null && !teacherDTO.getPassword().isEmpty()) {
            teacher.setPassword(passwordEncoder.encode(teacherDTO.getPassword()));
        }
        if (teacherDTO.getDepartmentId() != null) {
            Optional<Department> department = departmentRepository.findById(teacherDTO.getDepartmentId());
            department.ifPresent(teacher::setDepartment);
        }
        if (teacherDTO.getPositionId() != null) {
            Optional<Position> position = positionRepository.findById(teacherDTO.getPositionId());
            position.ifPresent(teacher::setPosition);
        }
        if (teacherDTO.getRoleId() != null) {
            Optional<Role> role = roleRepository.findById(teacherDTO.getRoleId());
            role.ifPresent(teacher::setRole);
        }

        Employee updatedTeacher = employeeRepository.save(teacher);
        return ResponseEntity.ok(new EmployeeDTO(
                updatedTeacher.getIdEmployee(),
                updatedTeacher.getSurname(),
                updatedTeacher.getName(),
                updatedTeacher.getSecondName(),
                updatedTeacher.getBirthDate(),
                updatedTeacher.getEmail(),
                updatedTeacher.getDepartment().getIdDepartment(),
                updatedTeacher.getDepartment().getName(),
                updatedTeacher.getPosition().getIdPosition(),
                updatedTeacher.getPosition().getName(),
                updatedTeacher.getRole() != null ? updatedTeacher.getRole().getIdRole() : null
        ));
    }
}