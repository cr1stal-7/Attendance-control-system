package com.example.attendance.repository;

import com.example.attendance.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    List<Department> findByParentDepartmentIsNull();
    List<Department> findByParentDepartmentIsNotNull();
    List<Department> findByParentDepartmentIdDepartment(Integer parentId);
    List<Department> findByParentDepartment_IdDepartment(Integer departmentId);
    List<Department> findByParentDepartment_IdDepartmentOrIdDepartment(Integer idDepartment, Integer idDepartment1);
}