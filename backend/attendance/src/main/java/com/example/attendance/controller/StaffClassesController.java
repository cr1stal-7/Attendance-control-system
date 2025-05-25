package com.example.attendance.controller;

import com.example.attendance.dto.*;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff/classes")
public class StaffClassesController {

    private final AcademicClassRepository classRepository;
    private final CurriculumSubjectRepository curriculumSubjectRepository;
    private final ClassTypeRepository classTypeRepository;
    private final ClassroomRepository classroomRepository;
    private final GroupRepository groupRepository;
    private final SemesterRepository semesterRepository;
    private final EmployeeRepository employeeRepository;

    public StaffClassesController(AcademicClassRepository classRepository,
                                  CurriculumSubjectRepository curriculumSubjectRepository,
                                  ClassTypeRepository classTypeRepository,
                                  ClassroomRepository classroomRepository,
                                  GroupRepository groupRepository,
                                  SemesterRepository semesterRepository,
                                  EmployeeRepository employeeRepository) {
        this.classRepository = classRepository;
        this.curriculumSubjectRepository = curriculumSubjectRepository;
        this.classTypeRepository = classTypeRepository;
        this.classroomRepository = classroomRepository;
        this.groupRepository = groupRepository;
        this.semesterRepository = semesterRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/semesters")
    public ResponseEntity<List<SemesterDTO>> getAllSemesters() {
        List<Semester> semesters = semesterRepository.findAll();
        return ResponseEntity.ok(semesters.stream()
                .map(s -> new SemesterDTO(s.getIdSemester(), s.getAcademicYear(), s.getType()))
                .collect(Collectors.toList()));
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<SubjectDTO>> getSubjectsForSemester(@RequestParam Integer semesterId) {
        try {
            List<Subject> subjects = curriculumSubjectRepository.findSubjectsBySemesterId(semesterId);
            return ResponseEntity.ok(subjects.stream()
                    .map(s -> new SubjectDTO(s.getIdSubject(), s.getName()))
                    .collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/groups")
    public ResponseEntity<List<GroupDTO>> getGroupsForSubject(@RequestParam Integer curriculumSubjectId) {
        Optional<CurriculumSubject> curriculumSubject = curriculumSubjectRepository.findById(curriculumSubjectId);
        if (curriculumSubject.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<StudentGroup> groups = groupRepository.findByCurriculumId(curriculumSubject.get().getCurriculum().getIdCurriculum());
        return ResponseEntity.ok(groups.stream()
                .map(g -> new GroupDTO(g.getIdGroup(), g.getName()))
                .collect(Collectors.toList()));
    }

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeClassDTO>> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return ResponseEntity.ok(employees.stream()
                .map(e -> new EmployeeClassDTO(
                        e.getIdEmployee(),
                        e.getSurname(),
                        e.getName(),
                        e.getSecondName()
                ))
                .collect(Collectors.toList()));
    }

    @GetMapping
    public ResponseEntity<List<AcademicClassDTO>> getClasses(
            @RequestParam(required = false) Integer curriculumSubjectId,
            @RequestParam(required = false) Integer semesterId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<AcademicClass> classes;
        if (curriculumSubjectId != null) {
            if (date != null) {
                classes = classRepository.findByCurriculumSubjectAndDate(curriculumSubjectId, date);
            } else {
                classes = classRepository.findByCurriculumSubjectId(curriculumSubjectId);
            }
        } else if (semesterId != null) {
            if (date != null) {
                classes = classRepository.findBySemesterAndDate(semesterId, date);
            } else {
                classes = classRepository.findBySemesterId(semesterId);
            }
        } else {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(classes.stream()
                .map(c -> new AcademicClassDTO(
                        c.getIdClass(),
                        c.getDatetime(),
                        c.getClassType() != null ? c.getClassType().getName() : null,
                        c.getCurriculumSubject().getSubject().getName(),
                        c.getGroups().stream().findFirst().map(StudentGroup::getName).orElse(null),
                        c.getClassroom() != null ? c.getClassroom().getNumber() : null,
                        c.getEmployee() != null ? c.getEmployee().getSurname() : null,
                        c.getEmployee() != null ? c.getEmployee().getName() : null,
                        c.getEmployee() != null ? c.getEmployee().getSecondName() : null
                ))
                .collect(Collectors.toList()));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<AcademicClassDTO> createClass(@RequestBody ClassCreateDTO classDTO) {
        try {
            System.out.println("Received DTO: " + classDTO); // Логируем входящий запрос
            if (classDTO.getDatetime() == null || classDTO.getCurriculumSubjectId() == null ||
                    classDTO.getGroupId() == null || classDTO.getEmployeeId() == null) {
                return ResponseEntity.badRequest().build();
            }

            Optional<CurriculumSubject> curriculumSubject = curriculumSubjectRepository.findById(classDTO.getCurriculumSubjectId());
            Optional<StudentGroup> group = groupRepository.findById(classDTO.getGroupId());
            Optional<ClassType> classType = classDTO.getClassTypeId() != null ?
                    classTypeRepository.findById(classDTO.getClassTypeId()) : Optional.empty();
            Optional<Classroom> classroom = classDTO.getClassroomId() != null ?
                    classroomRepository.findById(classDTO.getClassroomId()) : Optional.empty();
            Optional<Employee> employee = employeeRepository.findById(classDTO.getEmployeeId());

            if (curriculumSubject.isEmpty() || group.isEmpty() || employee.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            AcademicClass newClass = new AcademicClass();
            newClass.setDatetime(classDTO.getDatetime());
            newClass.setCurriculumSubject(curriculumSubject.get());
            newClass.setClassType(classType.orElse(null));
            newClass.setClassroom(classroom.orElse(null));
            newClass.setEmployee(employee.get());
            StudentGroup groupEntity = group.get();
            newClass.getGroups().add(groupEntity);

            groupEntity.getClasses().add(newClass);

            AcademicClass savedClass = classRepository.save(newClass);
            return ResponseEntity.ok(mapToAcademicClassDTO(savedClass));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    private AcademicClassDTO mapToAcademicClassDTO(AcademicClass academicClass) {
        return new AcademicClassDTO(
                academicClass.getIdClass(),
                academicClass.getDatetime(),
                academicClass.getClassType() != null ? academicClass.getClassType().getName() : null,
                academicClass.getCurriculumSubject().getSubject().getName(),
                academicClass.getGroups().stream().findFirst().map(StudentGroup::getName).orElse(null),
                academicClass.getClassroom() != null ? academicClass.getClassroom().getNumber() : null,
                academicClass.getEmployee() != null ? academicClass.getEmployee().getSurname() : null,
                academicClass.getEmployee() != null ? academicClass.getEmployee().getName() : null,
                academicClass.getEmployee() != null ? academicClass.getEmployee().getSecondName() : null
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcademicClassDTO> updateClass(
            @PathVariable Integer id,
            @RequestBody ClassUpdateDTO classDTO) {
        Optional<AcademicClass> classOpt = classRepository.findById(id);
        if (classOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AcademicClass academicClass = classOpt.get();
        if (classDTO.getDatetime() != null) {
            academicClass.setDatetime(classDTO.getDatetime());
        }
        if (classDTO.getClassTypeId() != null) {
            Optional<ClassType> classType = classTypeRepository.findById(classDTO.getClassTypeId());
            classType.ifPresent(academicClass::setClassType);
        }
        if (classDTO.getClassroomId() != null) {
            Optional<Classroom> classroom = classroomRepository.findById(classDTO.getClassroomId());
            classroom.ifPresent(academicClass::setClassroom);
        }

        AcademicClass updatedClass = classRepository.save(academicClass);
        return ResponseEntity.ok(new AcademicClassDTO(
                updatedClass.getIdClass(),
                updatedClass.getDatetime(),
                updatedClass.getClassType() != null ? updatedClass.getClassType().getName() : null,
                updatedClass.getCurriculumSubject().getSubject().getName(),
                updatedClass.getGroups().stream().findFirst().map(StudentGroup::getName).orElse(null),
                updatedClass.getClassroom() != null ? updatedClass.getClassroom().getNumber() : null,
                updatedClass.getEmployee() != null ? updatedClass.getEmployee().getSurname() : null,
                updatedClass.getEmployee() != null ? updatedClass.getEmployee().getName() : null,
                updatedClass.getEmployee() != null ? updatedClass.getEmployee().getSecondName() : null
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Integer id) {
        if (!classRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        classRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}