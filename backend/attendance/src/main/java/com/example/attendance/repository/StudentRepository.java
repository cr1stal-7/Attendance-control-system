package com.example.attendance.repository;

import com.example.attendance.model.Semester;
import com.example.attendance.model.Student;
import com.example.attendance.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    @Query("SELECT DISTINCT cs.semester FROM CurriculumSubject cs " +
            "JOIN cs.curriculum c " +
            "JOIN c.studentGroups g " +
            "JOIN g.students s " +
            "WHERE s.email = :email")
    List<Semester> findSemestersByStudentEmail(@Param("email") String email);

    @Query("SELECT DISTINCT cs.subject FROM CurriculumSubject cs " +
            "JOIN cs.curriculum c " +
            "JOIN c.studentGroups g " +
            "JOIN g.students s " +
            "WHERE s.email = :email AND cs.semester.idSemester = :semesterId")
    List<Subject> findSubjectsByStudentAndSemester(@Param("email") String email,
                                                   @Param("semesterId") Integer semesterId);

    @Query("SELECT s FROM Student s " +
            "LEFT JOIN FETCH s.group g " +
            "LEFT JOIN FETCH g.department " +
            "LEFT JOIN FETCH g.curriculum " +
            "WHERE s.email = :email")
    Optional<Student> findByEmailWithDetails(@Param("email") String email);

    @Query("SELECT s FROM Student s WHERE s.group.idGroup = :groupId")
    List<Student> findByGroupId(@Param("groupId") Integer groupId);
}