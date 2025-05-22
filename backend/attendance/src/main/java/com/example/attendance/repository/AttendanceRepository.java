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
    @Query("SELECT a FROM Attendance a WHERE a.student = :student AND a.classEntity.datetime BETWEEN :start AND :end")
    List<Attendance> findByStudentAndClassEntity_DatetimeBetween(
            @Param("student") Student student,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT a FROM Attendance a WHERE " +
            "a.student = :student AND " +
            "a.classEntity.curriculumSubject.subject.name = :subject AND " +
            "a.classEntity.datetime BETWEEN :start AND :end")
    List<Attendance> findByStudentAndClassEntity_CurriculumSubject_Subject_NameAndClassEntity_DatetimeBetween(
            @Param("student") Student student,
            @Param("subject") String subject,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    Optional<Attendance> findTopByStudentAndStatus_NameOrderByTimeDesc(
            Student student,
            String statusName
    );
}