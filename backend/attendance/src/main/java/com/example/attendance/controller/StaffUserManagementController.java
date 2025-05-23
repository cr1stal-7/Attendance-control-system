package com.example.attendance.controller;

import com.example.attendance.dto.*;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff/users")
public class StaffUserManagementController {

    private final EmployeeRepository employeeRepository;
    private final GroupRepository groupRepository;
    private final DepartmentRepository departmentRepository;
    private final StudentRepository studentRepository;

    public StaffUserManagementController(EmployeeRepository employeeRepository,
                                         GroupRepository groupRepository,
                                         DepartmentRepository departmentRepository,
                                         StudentRepository studentRepository) {
        this.employeeRepository = employeeRepository;
        this.groupRepository = groupRepository;
        this.departmentRepository = departmentRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping("/faculty")
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

    @GetMapping("/groups")
    public ResponseEntity<List<GroupDTO>> getAvailableGroups(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (employee.isEmpty() || employee.get().getDepartment() == null) {
            return ResponseEntity.notFound().build();
        }

        List<StudentGroup> groups = groupRepository.findByDepartment(employee.get().getDepartment());
        List<GroupDTO> groupDTOs = groups.stream()
                .map(group -> new GroupDTO(group.getIdGroup(), group.getName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(groupDTOs);
    }

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentDTO>> getAvailableDepartments(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (employee.isEmpty() || employee.get().getDepartment() == null) {
            return ResponseEntity.notFound().build();
        }

        Department faculty = employee.get().getDepartment();
        List<Department> departments = departmentRepository.findByParentDepartment(faculty);

        List<DepartmentDTO> departmentDTOs = departments.stream()
                .map(department -> new DepartmentDTO(department.getIdDepartment(), department.getName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(departmentDTOs);
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentDTO>> getStudentsByGroup(@RequestParam Integer groupId) {
        Optional<StudentGroup> group = groupRepository.findById(groupId);
        if (group.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Student> students = studentRepository.findByGroupId(groupId);
        List<StudentDTO> studentDTOs = students.stream()
                .map(student -> new StudentDTO(
                        student.getIdStudent(),
                        student.getSurname(),
                        student.getName(),
                        student.getSecondName(),
                        student.getEmail(),
                        student.getStudentCardId(),
                        student.getBirthDate()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(studentDTOs);
    }

    @PostMapping("/students")
    public ResponseEntity<StudentDTO> createStudent(@RequestBody StudentCreateDTO studentDTO) {
        try {
            // Проверка обязательных полей
            if (studentDTO.getSurname() == null || studentDTO.getName() == null ||
                    studentDTO.getBirthDate() == null || studentDTO.getPassword() == null ||
                    studentDTO.getGroupId() == null || studentDTO.getEmail() == null ||
                    studentDTO.getStudentCardId() == null) {
                return ResponseEntity.badRequest().build();
            }

            Optional<StudentGroup> group = groupRepository.findById(studentDTO.getGroupId());
            if (group.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            // Проверка уникальности email и studentCardId
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
            student.setPassword(studentDTO.getPassword());
            student.setEmail(studentDTO.getEmail());
            student.setStudentCardId(studentDTO.getStudentCardId());
            student.setGroup(group.get());

            Student savedStudent = studentRepository.save(student);

            return ResponseEntity.ok(new StudentDTO(
                    savedStudent.getIdStudent(),
                    savedStudent.getSurname(),
                    savedStudent.getName(),
                    savedStudent.getSecondName(),
                    savedStudent.getEmail(),
                    savedStudent.getStudentCardId(),
                    savedStudent.getBirthDate()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<StudentDTO> updateStudent(
            @PathVariable Integer id,
            @RequestBody StudentUpdateDTO studentDTO) {
        Optional<Student> studentOpt = studentRepository.findById(id);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Student student = studentOpt.get();
        if (studentDTO.getSurname() != null) {
            student.setSurname(studentDTO.getSurname());
        }
        if (studentDTO.getName() != null) {
            student.setName(studentDTO.getName());
        }
        if (studentDTO.getSecondName() != null) {
            student.setSecondName(studentDTO.getSecondName());
        }
        if (studentDTO.getEmail() != null) {
            student.setEmail(studentDTO.getEmail());
        }
        if (studentDTO.getStudentCardId() != null) {
            student.setStudentCardId(studentDTO.getStudentCardId());
        }

        Student updatedStudent = studentRepository.save(student);
        return ResponseEntity.ok(new StudentDTO(
                updatedStudent.getIdStudent(),
                updatedStudent.getSurname(),
                updatedStudent.getName(),
                updatedStudent.getSecondName(),
                updatedStudent.getEmail(),
                updatedStudent.getStudentCardId(),
                updatedStudent.getBirthDate()
        ));
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Integer id) {
        if (!studentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        studentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}