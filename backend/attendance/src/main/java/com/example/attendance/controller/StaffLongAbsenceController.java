package com.example.attendance.controller;

import com.example.attendance.dto.*;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/staff/long-absence")
public class StaffLongAbsenceController {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final GroupRepository groupRepository;
    private final ControlPointRecordRepository controlPointRecordRepository;

    public StaffLongAbsenceController(EmployeeRepository employeeRepository,
                                  AttendanceRepository attendanceRepository,
                                  StudentRepository studentRepository,
                                  GroupRepository groupRepository,
                                  ControlPointRecordRepository controlPointRecordRepository) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.groupRepository = groupRepository;
        this.controlPointRecordRepository = controlPointRecordRepository;
    }

    @GetMapping
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

        List<StudentGroup> groups = groupRepository.findByDepartment(employee.get().getDepartment());
        List<LongAbsenceDTO> result = new ArrayList<>();
        LocalDateTime thresholdDateTime = LocalDateTime.now().minusDays(daysThreshold);

        for (StudentGroup group : groups) {
            List<Student> students = studentRepository.findByGroupId(group.getIdGroup());

            for (Student student : students) {
                Optional<ControlPointRecord> lastEntry = controlPointRecordRepository
                        .findTopByStudentAndDirectionOrderByDatetimeDesc(student, "Вход");

                Optional<Attendance> lastClass = attendanceRepository
                        .findTopByStudentAndStatus_NameOrderByTimeDesc(student, "Присутствие");

                if (lastClass.isEmpty() || lastClass.get().getTime().isBefore(thresholdDateTime)) {
                    LongAbsenceDTO dto = new LongAbsenceDTO();
                    dto.setSurname(student.getSurname());
                    dto.setName(student.getName());
                    dto.setSecondName(student.getSecondName());
                    dto.setGroupName(group.getName());

                    lastClass.ifPresent(attendance -> dto.setLastClassDate(attendance.getTime()));
                    lastEntry.ifPresent(entry -> dto.setLastDate(entry.getDatetime()));

                    result.add(dto);
                }
            }
        }

        result.sort(Comparator.comparing(
                dto -> dto.getLastClassDate() != null ? dto.getLastClassDate() : LocalDateTime.MIN,
                Comparator.naturalOrder()
        ));

        return ResponseEntity.ok(result);
    }
}
