package com.example.attendance.controller;

import com.example.attendance.dto.AcademicClassManagementDTO;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff/classes")
public class StaffAcademicClassController {

    private final AcademicClassRepository classRepository;
    private final CurriculumSubjectRepository curriculumSubjectRepository;
    private final ClassroomRepository classroomRepository;
    private final ClassTypeRepository classTypeRepository;
    private final EmployeeRepository employeeRepository;
    private final StudentGroupRepository groupRepository;

    public StaffAcademicClassController(AcademicClassRepository classRepository,
                                   CurriculumSubjectRepository curriculumSubjectRepository,
                                   ClassroomRepository classroomRepository,
                                   ClassTypeRepository classTypeRepository,
                                   EmployeeRepository employeeRepository,
                                   StudentGroupRepository groupRepository) {
        this.classRepository = classRepository;
        this.curriculumSubjectRepository = curriculumSubjectRepository;
        this.classroomRepository = classroomRepository;
        this.classTypeRepository = classTypeRepository;
        this.employeeRepository = employeeRepository;
        this.groupRepository = groupRepository;
    }

    @GetMapping
    public ResponseEntity<List<AcademicClassManagementDTO>> getClasses(
            @RequestParam Integer curriculumId,
            @RequestParam Integer semesterId,
            @RequestParam(required = false) Integer subjectId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<AcademicClass> classes;

        if (date != null) {
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
            classes = classRepository.findByCurriculumAndSemesterAndDate(
                    curriculumId, semesterId, subjectId, startOfDay, endOfDay);
        } else {
            classes = classRepository.findByCurriculumAndSemester(
                    curriculumId, semesterId, subjectId);
        }

        List<AcademicClassManagementDTO> classDTOs = classes.stream()
                .map(c -> new AcademicClassManagementDTO(
                        c.getIdClass(),
                        c.getDatetime(),
                        c.getCurriculumSubject().getIdCurriculumSubject(),
                        c.getCurriculumSubject().getSubject().getName(),
                        c.getClassType().getIdClassType(),
                        c.getClassType().getName(),
                        c.getClassroom().getIdClassroom(),
                        c.getClassroom().getNumber(),
                        c.getEmployee().getIdEmployee(),
                        c.getEmployee().getSurname() + " " + c.getEmployee().getName().charAt(0) + "." +
                                (c.getEmployee().getSecondName() != null ?
                                        " " + c.getEmployee().getSecondName().charAt(0) + "." : ""),
                        c.getGroups().stream().map(StudentGroup::getName).collect(Collectors.joining(", ")),
                        c.getGroups().stream().map(StudentGroup::getIdGroup).collect(Collectors.toList())
                )).collect(Collectors.toList());

        return ResponseEntity.ok(classDTOs);
    }

    @PostMapping
    public ResponseEntity<AcademicClassManagementDTO> addClass(@RequestBody AcademicClassManagementDTO classDTO) {
        if (classDTO.getDatetime() == null || classDTO.getIdCurriculumSubject() == null ||
                classDTO.getIdClassType() == null || classDTO.getIdClassroom() == null ||
                classDTO.getIdEmployee() == null || classDTO.getGroupIds() == null || classDTO.getGroupIds().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        AcademicClass academicClass = new AcademicClass();
        academicClass.setDatetime(classDTO.getDatetime());

        curriculumSubjectRepository.findById(classDTO.getIdCurriculumSubject())
                .ifPresent(academicClass::setCurriculumSubject);
        classTypeRepository.findById(classDTO.getIdClassType())
                .ifPresent(academicClass::setClassType);
        classroomRepository.findById(classDTO.getIdClassroom())
                .ifPresent(academicClass::setClassroom);
        employeeRepository.findById(classDTO.getIdEmployee())
                .ifPresent(academicClass::setEmployee);

        AcademicClass savedClass = classRepository.save(academicClass);

        List<StudentGroup> groups = groupRepository.findAllById(classDTO.getGroupIds());
        savedClass.setGroups(groups);
        classRepository.save(savedClass);

        return ResponseEntity.ok(convertToDTO(savedClass));
    }

    @PutMapping("/{classId}")
    public ResponseEntity<AcademicClassManagementDTO> updateClass(
            @PathVariable Integer classId,
            @RequestBody AcademicClassManagementDTO classDTO) {

        Optional<AcademicClass> classOpt = classRepository.findById(classId);
        if (classOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AcademicClass academicClass = classOpt.get();
        if (classDTO.getDatetime() != null) {
            academicClass.setDatetime(classDTO.getDatetime());
        }
        if (classDTO.getIdCurriculumSubject() != null) {
            curriculumSubjectRepository.findById(classDTO.getIdCurriculumSubject())
                    .ifPresent(academicClass::setCurriculumSubject);
        }
        if (classDTO.getIdClassType() != null) {
            classTypeRepository.findById(classDTO.getIdClassType())
                    .ifPresent(academicClass::setClassType);
        }
        if (classDTO.getIdClassroom() != null) {
            classroomRepository.findById(classDTO.getIdClassroom())
                    .ifPresent(academicClass::setClassroom);
        }
        if (classDTO.getIdEmployee() != null) {
            employeeRepository.findById(classDTO.getIdEmployee())
                    .ifPresent(academicClass::setEmployee);
        }
        if (classDTO.getGroupIds() != null) {
            List<StudentGroup> groups = groupRepository.findAllById(classDTO.getGroupIds());
            academicClass.setGroups(groups);
        }

        AcademicClass updatedClass = classRepository.save(academicClass);
        return ResponseEntity.ok(convertToDTO(updatedClass));
    }

    @DeleteMapping("/{classId}")
    public ResponseEntity<Void> deleteClass(@PathVariable Integer classId) {
        if (!classRepository.existsById(classId)) {
            return ResponseEntity.notFound().build();
        }
        classRepository.deleteById(classId);
        return ResponseEntity.noContent().build();
    }

    private AcademicClassManagementDTO convertToDTO(AcademicClass academicClass) {
        String employeeName = academicClass.getEmployee().getSurname() + " " +
                academicClass.getEmployee().getName() +
                (academicClass.getEmployee().getSecondName() != null ?
                        " " + academicClass.getEmployee().getSecondName() : "");
        return new AcademicClassManagementDTO(
                academicClass.getIdClass(),
                academicClass.getDatetime(),
                academicClass.getCurriculumSubject().getIdCurriculumSubject(),
                academicClass.getCurriculumSubject().getSubject().getName(),
                academicClass.getClassType().getIdClassType(),
                academicClass.getClassType().getName(),
                academicClass.getClassroom().getIdClassroom(),
                academicClass.getClassroom().getNumber(),
                academicClass.getEmployee().getIdEmployee(),
                employeeName,
                academicClass.getGroups().stream().map(StudentGroup::getName).collect(Collectors.joining(", ")),
                academicClass.getGroups().stream().map(StudentGroup::getIdGroup).collect(Collectors.toList())
        );
    }
}