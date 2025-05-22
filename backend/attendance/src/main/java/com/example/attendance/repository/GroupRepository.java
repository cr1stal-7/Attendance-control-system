package com.example.attendance.repository;

import com.example.attendance.model.Department;
import com.example.attendance.model.StudentGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupRepository extends JpaRepository<StudentGroup, Integer> {
    List<StudentGroup> findByDepartment(Department department);
}