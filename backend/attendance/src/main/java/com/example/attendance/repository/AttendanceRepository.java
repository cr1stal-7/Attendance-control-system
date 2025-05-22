package com.example.attendance.repository;

import com.example.attendance.model.Attendance;
import com.example.attendance.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    @Query("SELECT a FROM Attendance a WHERE " +
            "a.student = :student AND " +
            "a.classEntity.curriculumSubject.subject.name = :subject AND " +
            "a.classEntity.curriculumSubject.semester.idSemester = :semesterId")
    List<Attendance> findByStudentAndClassEntity_CurriculumSubject_Subject_NameAndClassEntity_CurriculumSubject_Semester_IdSemester(
            @Param("student") Student student,
            @Param("subject") String subject,
            @Param("semesterId") Integer semesterId
    );

    @Query("SELECT a FROM Attendance a WHERE " +
            "a.student = :student AND " +
            "a.classEntity.curriculumSubject.semester.idSemester = :semesterId")
    List<Attendance> findByStudentAndClassEntity_CurriculumSubject_Semester_IdSemester(
            @Param("student") Student student,
            @Param("semesterId") Integer semesterId
    );

    Optional<Attendance> findTopByStudentAndStatus_NameOrderByTimeDesc(
            Student student,
            String statusName
    );

    @Query("SELECT a FROM Attendance a WHERE " +
            "a.student = :student AND " +
            "a.classEntity.curriculumSubject.subject.idSubject = :subjectId AND " +
            "a.classEntity.curriculumSubject.semester.idSemester = :semesterId")
    List<Attendance> findByStudentAndClassEntity_CurriculumSubject_Subject_IdSubjectAndClassEntity_CurriculumSubject_Semester_IdSemester(
            @Param("student") Student student,
            @Param("subjectId") Integer subjectId,
            @Param("semesterId") Integer semesterId
    );
}