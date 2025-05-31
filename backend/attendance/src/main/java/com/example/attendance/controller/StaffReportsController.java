package com.example.attendance.controller;

import com.example.attendance.dto.*;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff")
public class StaffReportsController {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final GroupRepository groupRepository;
    private final CurriculumSubjectRepository curriculumSubjectRepository;
    private final SemesterRepository semesterRepository;

    public StaffReportsController(EmployeeRepository employeeRepository,
                                  AttendanceRepository attendanceRepository,
                                  StudentRepository studentRepository,
                                  GroupRepository groupRepository,
                                  CurriculumSubjectRepository curriculumSubjectRepository,
                                  SemesterRepository semesterRepository) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.groupRepository = groupRepository;
        this.curriculumSubjectRepository = curriculumSubjectRepository;
        this.semesterRepository = semesterRepository;
    }

    @GetMapping("/faculty")
    public ResponseEntity<Map<String, String>> getFaculty(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (employee.isEmpty() || employee.get().getDepartment() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Map.of("name", employee.get().getDepartment().getName()));
    }

    @GetMapping("/groups")
    public ResponseEntity<List<GroupDTO>> getGroups(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmail(principal.getName());
        if (employee.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<StudentGroup> groups = groupRepository.findByDepartment(employee.get().getDepartment());
        List<GroupDTO> groupDTOs = groups.stream()
                .map(group -> new GroupDTO(group.getIdGroup(), group.getName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(groupDTOs);
    }

    @GetMapping("/semesters")
    public ResponseEntity<List<SemesterDTO>> getSemesters(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (employee.isEmpty() || employee.get().getDepartment() == null) {
            return ResponseEntity.notFound().build();
        }

        List<Semester> semesters = semesterRepository.findAllOrderedByAcademicYearAndTypeDesc();
        List<SemesterDTO> semesterDTOs = semesters.stream()
                .map(semester -> new SemesterDTO(semester.getIdSemester(), semester.getAcademicYear(), semester.getType()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(semesterDTOs);
    }

    @GetMapping("/reports/by-group")
    public ResponseEntity<List<Map<String, Object>>> getGroupReports(
            @RequestParam Integer groupId,
            @RequestParam Integer semesterId) {

        Optional<StudentGroup> groupOpt = groupRepository.findById(groupId);
        if (groupOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        StudentGroup group = groupOpt.get();
        Curriculum curriculum = group.getCurriculum();
        if (curriculum == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Subject> subjects = curriculumSubjectRepository
                .findSubjectsByCurriculumIdAndSemesterId(curriculum.getIdCurriculum(), semesterId);
        if (subjects.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Student> students = studentRepository.findByGroupId(groupId);
        List<Map<String, Object>> reports = new ArrayList<>();

        for (Student student : students) {
            Map<String, Object> studentReport = new HashMap<>();
            studentReport.put("surname", student.getSurname());
            studentReport.put("name", student.getName());
            studentReport.put("secondName", student.getSecondName());

            for (Subject subject : subjects) {
                List<Attendance> attendances = attendanceRepository
                        .findByStudentAndClassEntity_CurriculumSubject_Subject_IdSubjectAndClassEntity_CurriculumSubject_Semester_IdSemester(
                                student,
                                subject.getIdSubject(),
                                semesterId
                        );

                long totalClasses = attendances.stream()
                        .map(a -> a.getClassEntity().getIdClass())
                        .distinct()
                        .count();

                long attendedClasses = attendances.stream()
                        .filter(Attendance::getPresent)
                        .map(a -> a.getClassEntity().getIdClass())
                        .distinct()
                        .count();

                int attendancePercentage = totalClasses > 0 ?
                        (int) Math.round((double) attendedClasses / totalClasses * 100) : 0;

                studentReport.put(subject.getName(), attendancePercentage);
            }
            reports.add(studentReport);
        }
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/by-faculty")
    public ResponseEntity<List<Map<String, Object>>> getFacultyReports(
            Principal principal,
            @RequestParam Integer semesterId) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (employee.isEmpty() || employee.get().getDepartment() == null) {
            return ResponseEntity.notFound().build();
        }

        List<StudentGroup> groups = groupRepository.findByDepartment(employee.get().getDepartment());
        List<Map<String, Object>> reports = new ArrayList<>();

        Set<Subject> facultySubjects = new HashSet<>();
        for (StudentGroup group : groups) {
            if (group.getCurriculum() != null) {
                List<Subject> groupSubjects = curriculumSubjectRepository
                        .findSubjectsByCurriculumIdAndSemesterId(
                                group.getCurriculum().getIdCurriculum(),
                                semesterId
                        );
                facultySubjects.addAll(groupSubjects);
            }
        }

        if (facultySubjects.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        for (StudentGroup group : groups) {
            Map<String, Object> groupReport = new HashMap<>();
            groupReport.put("group", group.getName());

            Curriculum curriculum = group.getCurriculum();
            if (curriculum == null) {
                for (Subject subject : facultySubjects) {
                    groupReport.put(subject.getName(), "-");
                }
                reports.add(groupReport);
                continue;
            }

            List<Subject> groupSubjects = curriculumSubjectRepository
                    .findSubjectsByCurriculumIdAndSemesterId(curriculum.getIdCurriculum(), semesterId);
            Set<Integer> groupSubjectIds = groupSubjects.stream()
                    .map(Subject::getIdSubject)
                    .collect(Collectors.toSet());

            List<Student> students = studentRepository.findByGroupId(group.getIdGroup());

            for (Subject subject : facultySubjects) {
                if (!groupSubjectIds.contains(subject.getIdSubject())) {
                    groupReport.put(subject.getName(), "-");
                    continue;
                }

                List<Attendance> allGroupAttendances = attendanceRepository
                        .findByGroupAndSubjectAndSemester(
                                group.getIdGroup(),
                                subject.getIdSubject(),
                                semesterId
                        );

                long totalPossibleClasses = allGroupAttendances.stream()
                        .map(a -> a.getClassEntity().getIdClass())
                        .distinct()
                        .count();

//                if (totalPossibleClasses == 0) {
//                    groupReport.put(subject.getName(), "-");
//                    continue;
//                }

                double totalAttendance = 0;
                int studentsCounted = 0;

                for (Student student : students) {
                    List<Attendance> attendances = attendanceRepository
                            .findByStudentAndClassEntity_CurriculumSubject_Subject_IdSubjectAndClassEntity_CurriculumSubject_Semester_IdSemester(
                                    student,
                                    subject.getIdSubject(),
                                    semesterId
                            );

                    long attendedClasses = attendances.stream()
                            .filter(Attendance::getPresent)
                            .map(a -> a.getClassEntity().getIdClass())
                            .distinct()
                            .count();

                    if (totalPossibleClasses > 0) {
                        double studentPercentage = (double) attendedClasses / totalPossibleClasses * 100;
                        totalAttendance += studentPercentage;
                        studentsCounted++;
                    }
                }

                int averageAttendance = studentsCounted > 0 ?
                        (int) Math.round(totalAttendance / studentsCounted) : 0;
                groupReport.put(subject.getName(), averageAttendance);
            }
            reports.add(groupReport);
        }
        return ResponseEntity.ok(reports);
    }
}