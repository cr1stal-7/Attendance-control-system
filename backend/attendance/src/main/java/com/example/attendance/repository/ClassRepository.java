package com.example.attendance.repository;

import com.example.attendance.model.AcademicClass;
import com.example.attendance.model.StudentGroup;
import com.example.attendance.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface ClassRepository extends JpaRepository<AcademicClass, Integer> {

    boolean existsByCurriculumSubject_SubjectAndDatetimeBetween(
            Subject subject,
            LocalDateTime start,
            LocalDateTime end);

    boolean existsByCurriculumSubject_SubjectAndGroupsAndDatetimeBetween(
            Subject subject,
            StudentGroup group,
            LocalDateTime start,
            LocalDateTime end);
}
