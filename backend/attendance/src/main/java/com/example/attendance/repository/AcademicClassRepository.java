package com.example.attendance.repository;

import com.example.attendance.model.AcademicClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AcademicClassRepository extends JpaRepository<AcademicClass, Integer> {

    @Query("SELECT c FROM AcademicClass c WHERE c.curriculumSubject.idCurriculumSubject  = :curriculumSubjectId")
    List<AcademicClass> findByCurriculumSubjectId(@Param("curriculumSubjectId") Integer curriculumSubjectId);

    @Query("SELECT c FROM AcademicClass c WHERE c.curriculumSubject.idCurriculumSubject  = :curriculumSubjectId " +
            "AND CAST(c.datetime AS date) = :date")
    List<AcademicClass> findByCurriculumSubjectAndDate(
            @Param("curriculumSubjectId") Integer curriculumSubjectId,
            @Param("date") LocalDate date);

    @Query("SELECT c FROM AcademicClass c WHERE c.curriculumSubject.semester.idSemester = :semesterId")
    List<AcademicClass> findBySemesterId(@Param("semesterId") Integer semesterId);

    @Query("SELECT c FROM AcademicClass c WHERE c.curriculumSubject.semester.idSemester = :semesterId " +
            "AND CAST(c.datetime AS date) = :date")
    List<AcademicClass> findBySemesterAndDate(
            @Param("semesterId") Integer semesterId,
            @Param("date") LocalDate date);
}