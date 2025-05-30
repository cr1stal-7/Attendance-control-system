package com.example.attendance.controller;

import com.example.attendance.dto.StudentManagementDTO;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff/students")
public class StaffStudentController {

    private final StudentRepository studentRepository;
    private final GroupRepository groupRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffStudentController(StudentRepository studentRepository,
                                  GroupRepository groupRepository,
                                  EmployeeRepository employeeRepository,
                                  PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.groupRepository = groupRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<StudentManagementDTO>> getAllStudents(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (employee.isEmpty() || employee.get().getDepartment() == null) {
            return ResponseEntity.notFound().build();
        }

        Department faculty = employee.get().getDepartment();
        List<Student> students = studentRepository.findByGroupDepartment(faculty);

        List<StudentManagementDTO> studentDTOs = students.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(studentDTOs);
    }

    @GetMapping("/groups")
    public ResponseEntity<List<StudentGroup>> getFacultyGroups(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (employee.isEmpty() || employee.get().getDepartment() == null) {
            return ResponseEntity.notFound().build();
        }

        Department faculty = employee.get().getDepartment();
        List<StudentGroup> groups = groupRepository.findByDepartment(faculty);
        return ResponseEntity.ok(groups);
    }

    @PostMapping
    public ResponseEntity<StudentManagementDTO> createStudent(@RequestBody StudentManagementDTO studentDTO, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (employee.isEmpty() || employee.get().getDepartment() == null) {
            return ResponseEntity.notFound().build();
        }

        Department faculty = employee.get().getDepartment();

        Optional<StudentGroup> groupOpt = groupRepository.findById(studentDTO.getIdGroup());
        if (groupOpt.isEmpty() || !groupOpt.get().getDepartment().equals(faculty)) {
            return ResponseEntity.badRequest().build();
        }

        if (studentDTO.getSurname() == null || studentDTO.getName() == null ||
                studentDTO.getBirthDate() == null || studentDTO.getEmail() == null ||
                studentDTO.getStudentCardId() == null || studentDTO.getIdGroup() == null ||
                studentDTO.getPassword() == null) {
            return ResponseEntity.badRequest().build();
        }
        if (studentRepository.existsByEmail(studentDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
        if (studentRepository.existsByStudentCardId(studentDTO.getStudentCardId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        Student student = new Student();
        student.setSurname(studentDTO.getSurname());
        student.setName(studentDTO.getName());
        student.setSecondName(studentDTO.getSecondName());
        student.setBirthDate(studentDTO.getBirthDate());
        student.setEmail(studentDTO.getEmail());
        student.setStudentCardId(studentDTO.getStudentCardId());
        student.setPassword(passwordEncoder.encode(studentDTO.getPassword()));
        student.setGroup(groupOpt.get());

        Student savedStudent = studentRepository.save(student);
        return ResponseEntity.ok(mapToDTO(savedStudent));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentManagementDTO> updateStudent(
            @PathVariable Integer id,
            @RequestBody StudentManagementDTO studentDTO,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (employee.isEmpty() || employee.get().getDepartment() == null) {
            return ResponseEntity.notFound().build();
        }

        Department faculty = employee.get().getDepartment();
        Optional<Student> studentOpt = studentRepository.findById(id);

        if (studentOpt.isEmpty() ||
                studentOpt.get().getGroup() == null ||
                !studentOpt.get().getGroup().getDepartment().equals(faculty)) {
            return ResponseEntity.notFound().build();
        }

        Student student = studentOpt.get();

        if (studentDTO.getIdGroup() != null) {
            Optional<StudentGroup> newGroupOpt = groupRepository.findById(studentDTO.getIdGroup());
            if (newGroupOpt.isEmpty() || !newGroupOpt.get().getDepartment().equals(faculty)) {
                return ResponseEntity.badRequest().build();
            }
            newGroupOpt.ifPresent(student::setGroup);
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

        Student updatedStudent = studentRepository.save(student);
        return ResponseEntity.ok(mapToDTO(updatedStudent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Integer id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (employee.isEmpty() || employee.get().getDepartment() == null) {
            return ResponseEntity.notFound().build();
        }

        Department faculty = employee.get().getDepartment();
        Optional<Student> studentOpt = studentRepository.findById(id);

        if (studentOpt.isEmpty() ||
                studentOpt.get().getGroup() == null ||
                !studentOpt.get().getGroup().getDepartment().equals(faculty)) {
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