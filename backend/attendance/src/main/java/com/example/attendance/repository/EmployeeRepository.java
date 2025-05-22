package com.example.attendance.repository;

import com.example.attendance.model.Employee;
import com.example.attendance.model.Semester;
import com.example.attendance.model.StudentGroup;
import com.example.attendance.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
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
}