package com.example.attendance.controller;

import com.example.attendance.dto.StudentManagementDTO;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/accounts/students")
public class StudentManagementController {

    private final StudentRepository studentRepository;
    private final GroupRepository groupRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentManagementController(StudentRepository studentRepository,
                                       GroupRepository groupRepository,
                                       DepartmentRepository departmentRepository,
                                       EmployeeRepository employeeRepository,
                                       PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.groupRepository = groupRepository;
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<StudentManagementDTO>> getAllStudents(
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) Integer groupId) {

        List<Student> students;

        if (groupId != null) {
            students = studentRepository.findByGroupId(groupId);
        } else if (departmentId != null) {
            students = studentRepository.findByGroupDepartmentIdDepartment(departmentId);
        } else {
            students = studentRepository.findAll();
        }

        List<StudentManagementDTO> studentDTOs = students.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(studentDTOs);
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @GetMapping("/groups")
    public ResponseEntity<List<StudentGroup>> getGroupsByDepartment(
            @RequestParam Integer departmentId) {
        List<StudentGroup> groups = groupRepository.findByDepartmentIdDepartment(departmentId);
        return ResponseEntity.ok(groups);
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody StudentManagementDTO studentDTO) {
        if (studentDTO.getSurname() == null || studentDTO.getName() == null ||
                studentDTO.getBirthDate() == null || studentDTO.getEmail() == null ||
                studentDTO.getStudentCardId() == null || studentDTO.getIdGroup() == null ||
                studentDTO.getPassword() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (studentRepository.existsByEmail(studentDTO.getEmail()) ||
                employeeRepository.existsByEmail(studentDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("message","Email уже используется"));
        }

        if (studentRepository.existsByStudentCardId(studentDTO.getStudentCardId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("message","Номер студенческого билета уже используется"));
        }

        Student student = new Student();
        student.setSurname(studentDTO.getSurname());
        student.setName(studentDTO.getName());
        student.setSecondName(studentDTO.getSecondName());
        student.setBirthDate(studentDTO.getBirthDate());
        student.setEmail(studentDTO.getEmail());
        student.setStudentCardId(studentDTO.getStudentCardId());
        student.setPassword(passwordEncoder.encode(studentDTO.getPassword()));

        groupRepository.findById(studentDTO.getIdGroup()).ifPresent(student::setGroup);

        Student savedStudent = studentRepository.save(student);
        return ResponseEntity.ok(mapToDTO(savedStudent));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(
            @PathVariable Integer id,
            @RequestBody StudentManagementDTO studentDTO) {

        Optional<Student> studentOpt = studentRepository.findById(id);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Student student = studentOpt.get();

        if (studentDTO.getEmail() != null && !studentDTO.getEmail().equals(student.getEmail())) {
            if (studentRepository.existsByEmail(studentDTO.getEmail()) ||
                    employeeRepository.existsByEmail(studentDTO.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of("message","Email уже используется"));
            }
        }

        if (studentDTO.getStudentCardId() != null &&
                !studentDTO.getStudentCardId().equals(student.getStudentCardId())) {
            if (studentRepository.existsByStudentCardId(studentDTO.getStudentCardId())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of("message","Номер студенческого билета уже используется"));
            }
        }

        if (studentDTO.getSurname() != null) {
            student.setSurname(studentDTO.getSurname());
        }
        if (studentDTO.getName() != null) {
            student.setName(studentDTO.getName());
        }
        if (studentDTO.getSecondName() != null) {
            student.setSecondName(studentDTO.getSecondName());
        }
        if (studentDTO.getBirthDate() != null) {
            student.setBirthDate(studentDTO.getBirthDate());
        }
        if (studentDTO.getEmail() != null) {
            student.setEmail(studentDTO.getEmail());
        }
        if (studentDTO.getStudentCardId() != null) {
            student.setStudentCardId(studentDTO.getStudentCardId());
        }
        if (studentDTO.getPassword() != null) {
            student.setPassword(passwordEncoder.encode(studentDTO.getPassword()));
        }
        if (studentDTO.getIdGroup() != null) {
            groupRepository.findById(studentDTO.getIdGroup()).ifPresent(student::setGroup);
        }

        Student updatedStudent = studentRepository.save(student);
        return ResponseEntity.ok(mapToDTO(updatedStudent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Integer id) {
        if (!studentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        studentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private StudentManagementDTO mapToDTO(Student student) {
        return new StudentManagementDTO(
                student.getIdStudent(),
                student.getSurname(),
                student.getName(),
                student.getSecondName(),
                student.getBirthDate(),
                student.getEmail(),
                student.getStudentCardId(),
                null,
                student.getGroup() != null ? student.getGroup().getIdGroup() : null,
                student.getGroup() != null ? student.getGroup().getName() : null,
                student.getGroup() != null && student.getGroup().getDepartment() != null
                        ? student.getGroup().getDepartment().getName() : null
        );
    }
}