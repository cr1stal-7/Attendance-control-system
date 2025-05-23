package com.example.attendance.controller;

import com.example.attendance.dto.DepartmentDTO;
import com.example.attendance.dto.GroupDTO;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff/faculty")
public class StaffFacultyController {

    private final EmployeeRepository employeeRepository;
    private final GroupRepository groupRepository;
    private final DepartmentRepository departmentRepository;

    public StaffFacultyController(EmployeeRepository employeeRepository,
                                  GroupRepository groupRepository,
                                  DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.groupRepository = groupRepository;
        this.departmentRepository = departmentRepository;
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
}