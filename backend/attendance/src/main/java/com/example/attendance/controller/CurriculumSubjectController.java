package com.example.attendance.controller;

import com.example.attendance.dto.CurriculumSubjectDTO;
import com.example.attendance.dto.SemesterDTO;
import com.example.attendance.dto.SubjectDTO;
import com.example.attendance.model.Curriculum;
import com.example.attendance.model.CurriculumSubject;
import com.example.attendance.repository.CurriculumRepository;
import com.example.attendance.repository.CurriculumSubjectRepository;
import com.example.attendance.repository.SemesterRepository;
import com.example.attendance.repository.SubjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/education/curriculum-subjects")
public class CurriculumSubjectController {

    private final CurriculumSubjectRepository curriculumSubjectRepository;
    private final CurriculumRepository curriculumRepository;
    private final SubjectRepository subjectRepository;
    private final SemesterRepository semesterRepository;

    public CurriculumSubjectController(CurriculumSubjectRepository curriculumSubjectRepository,
                                       CurriculumRepository curriculumRepository,
                                       SubjectRepository subjectRepository,
                                       SemesterRepository semesterRepository) {
        this.curriculumSubjectRepository = curriculumSubjectRepository;
        this.curriculumRepository = curriculumRepository;
        this.subjectRepository = subjectRepository;
        this.semesterRepository = semesterRepository;
    }

    @GetMapping
    public ResponseEntity<List<CurriculumSubjectDTO>> getAllSubjects(@RequestParam Integer curriculumId) {
        if (!curriculumRepository.existsById(curriculumId)) {
            return ResponseEntity.notFound().build();
        }

        List<CurriculumSubject> subjects = curriculumSubjectRepository.findByCurriculumIdCurriculum(curriculumId);

        List<CurriculumSubjectDTO> subjectDTOs = subjects.stream()
                .map(s -> new CurriculumSubjectDTO(
                        s.getIdCurriculumSubject(),
                        s.getHours(),
                        s.getSubject().getIdSubject(),
                        s.getSubject().getName(),
                        s.getSemester().getIdSemester(),
                        s.getSemester().getAcademicYear(),
                        s.getSemester().getType(),
                        s.getCurriculum().getIdCurriculum()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(subjectDTOs);
    }

    @PostMapping
    public ResponseEntity<CurriculumSubjectDTO> addSubject(
            @RequestParam Integer curriculumId,
            @RequestBody CurriculumSubjectDTO subjectDTO) {

        if (subjectDTO.getHours() == null || subjectDTO.getIdSubject() == null ||
                subjectDTO.getIdSemester() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Curriculum> curriculumOpt = curriculumRepository.findById(curriculumId);
        if (curriculumOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CurriculumSubject subject = new CurriculumSubject();
        subject.setHours(subjectDTO.getHours());
        subject.setCurriculum(curriculumOpt.get());

        subjectRepository.findById(subjectDTO.getIdSubject())
                .ifPresent(subject::setSubject);
        semesterRepository.findById(subjectDTO.getIdSemester())
                .ifPresent(subject::setSemester);

        CurriculumSubject savedSubject = curriculumSubjectRepository.save(subject);

        return ResponseEntity.ok(new CurriculumSubjectDTO(
                savedSubject.getIdCurriculumSubject(),
                savedSubject.getHours(),
                savedSubject.getSubject().getIdSubject(),
                savedSubject.getSubject().getName(),
                savedSubject.getSemester().getIdSemester(),
                savedSubject.getSemester().getAcademicYear(),
                savedSubject.getSemester().getType(),
                savedSubject.getCurriculum().getIdCurriculum()
        ));
    }

    @GetMapping("/semesters")
    public ResponseEntity<List<SemesterDTO>> getSemestersByCurriculum(@RequestParam Integer curriculumId) {
        if (!curriculumRepository.existsById(curriculumId)) {
            return ResponseEntity.notFound().build();
        }

        List<CurriculumSubject> curriculumSubjects = curriculumSubjectRepository.findByCurriculumIdCurriculum(curriculumId);

        List<SemesterDTO> semesters = curriculumSubjects.stream()
                .map(cs -> cs.getSemester())
                .distinct()
                .map(s -> new SemesterDTO(
                        s.getIdSemester(),
                        s.getAcademicYear(),
                        s.getType()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(semesters);
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<SubjectDTO>> getSubjectsByCurriculum(@RequestParam Integer curriculumId) {
        if (!curriculumRepository.existsById(curriculumId)) {
            return ResponseEntity.notFound().build();
        }

        List<CurriculumSubject> curriculumSubjects = curriculumSubjectRepository.findByCurriculumIdCurriculum(curriculumId);

        List<SubjectDTO> subjects = curriculumSubjects.stream()
                .map(cs -> cs.getSubject())
                .distinct()
                .map(s -> new SubjectDTO(
                        s.getIdSubject(),
                        s.getName()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(subjects);
    }

    @PutMapping("/{subjectId}")
    public ResponseEntity<CurriculumSubjectDTO> updateSubject(
            @RequestParam Integer curriculumId,
            @PathVariable Integer subjectId,
            @RequestBody CurriculumSubjectDTO subjectDTO) {

        Optional<CurriculumSubject> subjectOpt = curriculumSubjectRepository.findById(subjectId);
        if (subjectOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CurriculumSubject subject = subjectOpt.get();
        if (subjectDTO.getHours() != null) {
            subject.setHours(subjectDTO.getHours());
        }
        if (subjectDTO.getIdSubject() != null) {
            subjectRepository.findById(subjectDTO.getIdSubject())
                    .ifPresent(subject::setSubject);
        }
        if (subjectDTO.getIdSemester() != null) {
            semesterRepository.findById(subjectDTO.getIdSemester())
                    .ifPresent(subject::setSemester);
        }

        CurriculumSubject updatedSubject = curriculumSubjectRepository.save(subject);

        return ResponseEntity.ok(new CurriculumSubjectDTO(
                updatedSubject.getIdCurriculumSubject(),
                updatedSubject.getHours(),
                updatedSubject.getSubject().getIdSubject(),
                updatedSubject.getSubject().getName(),
                updatedSubject.getSemester().getIdSemester(),
                updatedSubject.getSemester().getAcademicYear(),
                updatedSubject.getSemester().getType(),
                updatedSubject.getCurriculum().getIdCurriculum()
        ));
    }

    @DeleteMapping("/{subjectId}")
    public ResponseEntity<Void> deleteSubject(
            @RequestParam Integer curriculumId,
            @PathVariable Integer subjectId) {

        if (!curriculumSubjectRepository.existsById(subjectId)) {
            return ResponseEntity.notFound().build();
        }

        curriculumSubjectRepository.deleteById(subjectId);
        return ResponseEntity.noContent().build();
    }
}