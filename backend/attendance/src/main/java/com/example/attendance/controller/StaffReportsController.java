package com.example.attendance.controller;

import com.example.attendance.dto.*;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
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
    private final ClassRepository classRepository;
    private final ControlPointRecordRepository controlPointRecordRepository;

    public StaffReportsController(EmployeeRepository employeeRepository,
                                  AttendanceRepository attendanceRepository,
                                  StudentRepository studentRepository,
                                  GroupRepository groupRepository,
                                  CurriculumSubjectRepository curriculumSubjectRepository,
                                  ClassRepository classRepository,
                                  ControlPointRecordRepository controlPointRecordRepository) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.groupRepository = groupRepository;
        this.curriculumSubjectRepository = curriculumSubjectRepository;
        this.classRepository = classRepository;
        this.controlPointRecordRepository = controlPointRecordRepository;
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

    @GetMapping("/reports/by-group")
    public ResponseEntity<List<Map<String, Object>>> getGroupReports(
            @RequestParam Integer groupId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Optional<StudentGroup> groupOpt = groupRepository.findById(groupId);
        if (groupOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        StudentGroup group = groupOpt.get();

        Curriculum curriculum = group.getCurriculum();
        if (curriculum == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Subject> subjects = curriculumSubjectRepository.findSubjectsByCurriculumId(curriculum.getIdCurriculum());
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
                        .findByStudentAndClassEntity_CurriculumSubject_Subject_NameAndClassEntity_DatetimeBetween(
                                student,
                                subject.getName(),
                                startDate.atStartOfDay(),
                                endDate.atStartOfDay().plusDays(1)
                        );

                boolean hasClasses = classRepository.existsByCurriculumSubject_SubjectAndDatetimeBetween(
                        subject,
                        startDate.atStartOfDay(),
                        endDate.atStartOfDay().plusDays(1)
                );

                if (!hasClasses) {
                    studentReport.put(subject.getName(), "н/з");
                    continue;
                }

                int totalClasses = attendances.size();
                int attendedClasses = (int) attendances.stream()
                        .filter(Attendance::getPresent)
                        .count();
                int attendancePercentage = totalClasses > 0 ?
                        (int) ((double) attendedClasses / totalClasses * 100) : 0;

                studentReport.put(subject.getName(), attendancePercentage);
            }

            reports.add(studentReport);
        }

        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/by-faculty")
    public ResponseEntity<List<Map<String, Object>>> getFacultyReports(
            Principal principal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (employee.isEmpty() || employee.get().getDepartment() == null) {
            return ResponseEntity.notFound().build();
        }

        List<StudentGroup> groups = groupRepository.findByDepartment(employee.get().getDepartment());
        List<Map<String, Object>> reports = new ArrayList<>();

        Map<String, Set<Integer>> groupSubjectsMap = new HashMap<>(); // groupName -> subjectIds
        Set<Subject> facultySubjects = new HashSet<>();

        for (StudentGroup group : groups) {
            Set<Integer> groupSubjectIds = new HashSet<>();
            if (group.getCurriculum() != null) {
                List<Subject> groupSubjects = curriculumSubjectRepository
                        .findSubjectsByCurriculumId(group.getCurriculum().getIdCurriculum());
                groupSubjects.forEach(s -> groupSubjectIds.add(s.getIdSubject()));
                facultySubjects.addAll(groupSubjects);
            }
            groupSubjectsMap.put(group.getName(), groupSubjectIds);
        }

        if (facultySubjects.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        for (StudentGroup group : groups) {
            Map<String, Object> groupReport = new HashMap<>();
            groupReport.put("group", group.getName());
            Set<Integer> groupSubjectIds = groupSubjectsMap.get(group.getName());

            List<Student> students = studentRepository.findByGroupId(group.getIdGroup());

            for (Subject subject : facultySubjects) {
                if (!groupSubjectIds.contains(subject.getIdSubject())) {
                    groupReport.put(subject.getName(), "-");
                    continue;
                }

                boolean hasClasses = classRepository.existsByCurriculumSubject_SubjectAndGroupsAndDatetimeBetween(
                        subject,
                        group,
                        startDate.atStartOfDay(),
                        endDate.atStartOfDay().plusDays(1)
                );

                if (!hasClasses) {
                    groupReport.put(subject.getName(), "н/з");
                    continue;
                }

                double totalAttendancePercentage = 0;
                int studentsWithAttendance = 0;

                for (Student student : students) {
                    List<Attendance> attendances = attendanceRepository
                            .findByStudentAndClassEntity_CurriculumSubject_Subject_NameAndClassEntity_DatetimeBetween(
                                    student,
                                    subject.getName(),
                                    startDate.atStartOfDay(),
                                    endDate.atStartOfDay().plusDays(1)
                            );

                    int totalClasses = attendances.size();
                    if (totalClasses == 0) continue;

                    int attendedClasses = (int) attendances.stream()
                            .filter(Attendance::getPresent)
                            .count();
                    double studentAttendancePercentage =
                            (double) attendedClasses / totalClasses * 100;

                    totalAttendancePercentage += studentAttendancePercentage;
                    studentsWithAttendance++;
                }

                double averageAttendancePercentage = studentsWithAttendance > 0 ?
                        totalAttendancePercentage / studentsWithAttendance : 0;
                groupReport.put(subject.getName(), Math.round(averageAttendancePercentage));
            }

            reports.add(groupReport);
        }

        return ResponseEntity.ok(reports);
    }
    @GetMapping("/long-absence")
    public ResponseEntity<List<LongAbsenceDTO>> getLongAbsenceReport(
            Principal principal,
            @RequestParam(defaultValue = "14") int daysThreshold) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Optional<Employee> employee = employeeRepository.findByEmailWithDetails(principal.getName());
        if (employee.isEmpty() || employee.get().getDepartment() == null) {
            return ResponseEntity.notFound().build();
        }

        LocalDate checkDate = LocalDate.now().minusDays(daysThreshold);
        List<StudentGroup> groups = groupRepository.findByDepartment(employee.get().getDepartment());
        List<LongAbsenceDTO> result = new ArrayList<>();

        for (StudentGroup group : groups) {
            List<Student> students = studentRepository.findByGroupId(group.getIdGroup());

            for (Student student : students) {
                Optional<ControlPointRecord> lastEntry = controlPointRecordRepository
                        .findTopByStudentAndDirectionOrderByDatetimeDesc(student, "Вход");

                Optional<Attendance> lastClass = attendanceRepository
                        .findTopByStudentAndStatus_NameOrderByTimeDesc(student, "Присутствовал");

                boolean hasRecentClass = lastClass
                        .filter(att -> att.getTime().toLocalDate().isAfter(checkDate))
                        .isPresent();

                if (!hasRecentClass) {
                    LongAbsenceDTO dto = new LongAbsenceDTO();
                    dto.setSurname(student.getSurname());
                    dto.setName(student.getName());
                    dto.setSecondName(student.getSecondName());
                    dto.setGroupName(group.getName());

                    lastClass.ifPresent(att ->
                            dto.setLastClassDate(att.getTime().toLocalDate()));

                    lastEntry.ifPresent(entry ->
                            dto.setLastDate(entry.getDatetime().toLocalDate()));

                    result.add(dto);
                }
            }
        }

        return ResponseEntity.ok(result);
    }
}