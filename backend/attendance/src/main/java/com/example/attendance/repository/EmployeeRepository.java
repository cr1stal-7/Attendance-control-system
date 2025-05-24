package com.example.attendance.repository;

import com.example.attendance.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    Optional<Employee> findByEmail(String email);

    @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.department WHERE e.email = :email")
    Optional<Employee> findByEmailWithDetails(@Param("email") String email);

    @Query("SELECT DISTINCT cs.semester FROM AcademicClass ac " +
            "JOIN ac.curriculumSubject cs " +
            "WHERE ac.employee.idEmployee = :teacherId")
    List<Semester> findSemestersByTeacher(@Param("teacherId") Integer teacherId);

    @Query("SELECT DISTINCT cs.subject FROM AcademicClass ac " +
            "JOIN ac.curriculumSubject cs " +
            "WHERE ac.employee.idEmployee = :teacherId " +
            "AND cs.semester.idSemester = :semesterId")
    List<Subject> findSubjectsByTeacherAndSemester(
            @Param("teacherId") Integer teacherId,
            @Param("semesterId") Integer semesterId);

    @Query("SELECT DISTINCT g FROM AcademicClass ac " +
            "JOIN ac.groups g " +
            "JOIN ac.curriculumSubject cs " +
            "WHERE ac.employee.idEmployee = :teacherId " +
            "AND cs.subject.idSubject = :subjectId " +
            "AND cs.semester.idSemester = :semesterId")
    List<StudentGroup> findGroupsByTeacherAndSubjectAndSemester(
            @Param("teacherId") Integer teacherId,
            @Param("subjectId") Integer subjectId,
            @Param("semesterId") Integer semesterId);

    @Query("SELECT COUNT(ac) > 0 FROM AcademicClass ac " +
            "JOIN ac.groups g " +
            "JOIN ac.curriculumSubject cs " +
            "WHERE ac.employee.idEmployee = :teacherId " +
            "AND g.idGroup = :groupId " +
            "AND cs.subject.idSubject = :subjectId " +
            "AND cs.semester.idSemester = :semesterId")
    boolean isTeacherAssignedToGroupSubjectSemester(
            @Param("teacherId") Integer teacherId,
            @Param("groupId") Integer groupId,
            @Param("subjectId") Integer subjectId,
            @Param("semesterId") Integer semesterId);

    @Query("SELECT COUNT(ac) > 0 FROM AcademicClass ac " +
            "WHERE ac.employee.idEmployee = :teacherId " +
            "AND ac.curriculumSubject.subject.idSubject = :subjectId " +
            "AND ac.curriculumSubject.semester.idSemester = :semesterId")
    boolean isTeacherAssignedToSubjectSemester(
            @Param("teacherId") Integer teacherId,
            @Param("subjectId") Integer subjectId,
            @Param("semesterId") Integer semesterId);

    @Query("SELECT ac FROM AcademicClass ac " +
            "JOIN FETCH ac.curriculumSubject cs " +
            "JOIN FETCH cs.subject " +
            "WHERE ac.employee.idEmployee = :teacherId " +
            "AND cs.subject.idSubject = :subjectId " +
            "AND cs.semester.idSemester = :semesterId")
    List<AcademicClass> findClassesByTeacherSubject(
            @Param("teacherId") Integer teacherId,
            @Param("subjectId") Integer subjectId,
            @Param("semesterId") Integer semesterId);

    @Query("SELECT ac FROM AcademicClass ac " +
            "JOIN FETCH ac.curriculumSubject cs " +
            "WHERE ac.employee.idEmployee = :teacherId " +
            "AND cs.subject.idSubject = :subjectId " +
            "AND cs.semester.idSemester = :semesterId " +
            "AND FUNCTION('DATE', ac.datetime) = :date")
    List<AcademicClass> findClassesByTeacherSubjectAndDate(
            @Param("teacherId") Integer teacherId,
            @Param("subjectId") Integer subjectId,
            @Param("semesterId") Integer semesterId,
            @Param("date") LocalDate date);

    @Query("SELECT COUNT(ac) > 0 FROM AcademicClass ac " +
            "WHERE ac.idClass = :classId " +
            "AND ac.employee.idEmployee = :teacherId")
    boolean isClassBelongsToTeacher(
            @Param("classId") Integer classId,
            @Param("teacherId") Integer teacherId);

    @Query("SELECT ac FROM AcademicClass ac " +
            "JOIN FETCH ac.curriculumSubject cs " +
            "JOIN FETCH cs.subject " +
            "JOIN FETCH cs.semester " +
            "LEFT JOIN FETCH ac.groups " +
            "WHERE ac.idClass = :classId")
    Optional<AcademicClass> findClassById(@Param("classId") Integer classId);

    boolean existsByEmail(String email);

    List<Employee> findByDepartment(Department department);
}