package com.example.attendance.repository;

import com.example.attendance.model.CurriculumSubject;
import com.example.attendance.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CurriculumSubjectRepository extends JpaRepository<CurriculumSubject, Integer> {

    @Query("SELECT DISTINCT cs.subject FROM CurriculumSubject cs " +
            "WHERE cs.curriculum.idCurriculum = :curriculumId")
    List<Subject> findSubjectsByCurriculumId(@Param("curriculumId") Integer curriculumId);
}
