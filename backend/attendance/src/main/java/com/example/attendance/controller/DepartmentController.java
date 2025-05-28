package com.example.attendance.controller;

import com.example.attendance.dto.DepartmentManagementDTO;
import com.example.attendance.model.Department;
import com.example.attendance.repository.DepartmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/structure/departments")
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    public DepartmentController(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @GetMapping
    public ResponseEntity<List<DepartmentManagementDTO>> getAllDepartments(
            @RequestParam(required = false) Boolean isFaculty,
            @RequestParam(required = false) Integer parentId) {

        List<Department> departments;

        if (isFaculty != null) {
            if (isFaculty) {
                departments = departmentRepository.findByParentDepartmentIsNull();
            } else {
                if (parentId != null) {
                    departments = departmentRepository.findByParentDepartmentIdDepartment(parentId);
                } else {
                    departments = departmentRepository.findByParentDepartmentIsNotNull();
                }
            }
        } else {
            departments = departmentRepository.findAll();
        }

        List<DepartmentManagementDTO> departmentDTOs = departments.stream()
                .map(d -> new DepartmentManagementDTO(
                        d.getIdDepartment(),
                        d.getName(),
                        d.getShortName(),
                        d.getParentDepartment() != null ? d.getParentDepartment().getIdDepartment() : null,
                        d.getParentDepartment() != null ? d.getParentDepartment().getName() : null))
                .collect(Collectors.toList());

        return ResponseEntity.ok(departmentDTOs);
    }

    @GetMapping("/faculties")
    public ResponseEntity<List<Department>> getFaculties() {
        List<Department> faculties = departmentRepository.findByParentDepartmentIsNull();
        return ResponseEntity.ok(faculties);
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getDepartmentsByFaculty(
            @RequestParam(required = false) Integer facultyId) {
        List<Department> departments;
        if (facultyId != null) {
            departments = departmentRepository.findByParentDepartmentIdDepartment(facultyId);
        } else {
            departments = departmentRepository.findByParentDepartmentIsNotNull();
        }
        return ResponseEntity.ok(departments);
    }

    @PostMapping
    public ResponseEntity<DepartmentManagementDTO> createDepartment(@RequestBody DepartmentManagementDTO departmentDTO) {
        if (departmentDTO.getName() == null || departmentDTO.getShortName() == null) {
            return ResponseEntity.badRequest().build();
        }

        Department department = new Department();
        department.setName(departmentDTO.getName());
        department.setShortName(departmentDTO.getShortName());

        if (departmentDTO.getParentId() != null) {
            departmentRepository.findById(departmentDTO.getParentId())
                    .ifPresent(department::setParentDepartment);
        }

        Department savedDepartment = departmentRepository.save(department);
        return ResponseEntity.ok(new DepartmentManagementDTO(
                savedDepartment.getIdDepartment(),
                savedDepartment.getName(),
                savedDepartment.getShortName(),
                savedDepartment.getParentDepartment() != null
                        ? savedDepartment.getParentDepartment().getIdDepartment()
                        : null,
                savedDepartment.getParentDepartment() != null
                        ? savedDepartment.getParentDepartment().getName()
                        : null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentManagementDTO> updateDepartment(
            @PathVariable Integer id,
            @RequestBody DepartmentManagementDTO departmentDTO) {
        Optional<Department> departmentOpt = departmentRepository.findById(id);
        if (departmentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Department department = departmentOpt.get();
        if (departmentDTO.getName() != null) {
            department.setName(departmentDTO.getName());
        }
        if (departmentDTO.getShortName() != null) {
            department.setShortName(departmentDTO.getShortName());
        }
        if (departmentDTO.getParentId() != null) {
            departmentRepository.findById(departmentDTO.getParentId())
                    .ifPresent(department::setParentDepartment);
        } else {
            department.setParentDepartment(null);
        }

        Department updatedDepartment = departmentRepository.save(department);
        return ResponseEntity.ok(new DepartmentManagementDTO(
                updatedDepartment.getIdDepartment(),
                updatedDepartment.getName(),
                updatedDepartment.getShortName(),
                updatedDepartment.getParentDepartment() != null
                        ? updatedDepartment.getParentDepartment().getIdDepartment()
                        : null,
                updatedDepartment.getParentDepartment() != null
                        ? updatedDepartment.getParentDepartment().getName()
                        : null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Integer id) {
        if (!departmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        departmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}