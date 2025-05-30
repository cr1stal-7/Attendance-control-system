package com.example.attendance.repository;

import com.example.attendance.model.Department;
import com.example.attendance.model.StudentGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GroupRepository extends JpaRepository<StudentGroup, Integer> {
    List<StudentGroup> findByDepartment(Department department);
    List<StudentGroup> findByDepartmentIdDepartment(Integer departmentId);
    List<StudentGroup> findByCurriculumIdCurriculum(Integer curriculumId);

    @Query("SELECT g FROM StudentGroup g WHERE g.department.idDepartment = :departmentId AND g.curriculum.idCurriculum = :curriculumId")
    List<StudentGroup> findByDepartmentIdDepartmentAndCurriculumIdCurriculum(
            @Param("departmentId") Integer departmentId,
            @Param("curriculumId") Integer curriculumId);
}