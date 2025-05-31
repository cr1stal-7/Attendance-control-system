package com.example.attendance.repository;

import com.example.attendance.model.StudentGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentGroupRepository extends JpaRepository<StudentGroup, Integer> {

    @Query("SELECT g FROM StudentGroup g " +
            "WHERE g.curriculum.idCurriculum = :curriculumId " +
            "AND g.department.idDepartment = :departmentId")
    List<StudentGroup> findByCurriculumIdAndDepartmentId(
            @Param("curriculumId") Integer curriculumId,
            @Param("departmentId") Integer departmentId);
}