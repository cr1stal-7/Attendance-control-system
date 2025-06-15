package com.example.attendance.repository;

import com.example.attendance.model.AcademicClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AcademicClassRepository extends JpaRepository<AcademicClass, Integer> {

    @Query("SELECT c FROM AcademicClass c " +
            "JOIN c.curriculumSubject cs " +
            "JOIN cs.curriculum cu " +
            "JOIN cs.semester s " +
            "WHERE cu.idCurriculum = :curriculumId " +
            "AND s.idSemester = :semesterId " +
            "AND (:subjectId IS NULL OR cs.subject.idSubject = :subjectId)")
    List<AcademicClass> findByCurriculumAndSemester(
            @Param("curriculumId") Integer curriculumId,
            @Param("semesterId") Integer semesterId,
            @Param("subjectId") Integer subjectId);

    @Query("SELECT c FROM AcademicClass c " +
            "JOIN c.curriculumSubject cs " +
            "JOIN cs.curriculum cu " +
            "JOIN cs.semester s " +
            "WHERE cu.idCurriculum = :curriculumId " +
            "AND s.idSemester = :semesterId " +
            "AND (:subjectId IS NULL OR cs.subject.idSubject = :subjectId) " +
            "AND c.datetime >= :startDate AND c.datetime < :endDate")
    List<AcademicClass> findByCurriculumAndSemesterAndDate(
            @Param("curriculumId") Integer curriculumId,
            @Param("semesterId") Integer semesterId,
            @Param("subjectId") Integer subjectId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}