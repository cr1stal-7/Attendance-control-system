package com.example.attendance.repository;

import com.example.attendance.model.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, Integer> {
    @Query("SELECT s FROM Semester s ORDER BY s.academicYear DESC, s.type DESC")
    List<Semester> findAllOrderedByAcademicYearAndTypeDesc();
}