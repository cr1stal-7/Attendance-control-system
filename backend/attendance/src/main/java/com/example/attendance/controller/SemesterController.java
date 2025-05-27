package com.example.attendance.controller;

import com.example.attendance.dto.SemesterDTO;
import com.example.attendance.model.Semester;
import com.example.attendance.repository.SemesterRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/education/semesters")
public class SemesterController {

    private final SemesterRepository semesterRepository;

    public SemesterController(SemesterRepository semesterRepository) {
        this.semesterRepository = semesterRepository;
    }

    @GetMapping
    public ResponseEntity<List<SemesterDTO>> getAllSemesters() {
        List<Semester> semesters = semesterRepository.findAll();
        List<SemesterDTO> semesterDTOs = semesters.stream()
                .map(s -> new SemesterDTO(s.getIdSemester(), s.getAcademicYear(), s.getType()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(semesterDTOs);
    }

    @PostMapping
    public ResponseEntity<SemesterDTO> createSemester(@RequestBody SemesterDTO semesterDTO) {
        if (semesterDTO.getAcademicYear() == null || semesterDTO.getType() == null) {
            return ResponseEntity.badRequest().build();
        }

        Semester semester = new Semester();
        semester.setAcademicYear(semesterDTO.getAcademicYear());
        semester.setType(semesterDTO.getType());

        Semester savedSemester = semesterRepository.save(semester);
        return ResponseEntity.ok(new SemesterDTO(
                savedSemester.getIdSemester(),
                savedSemester.getAcademicYear(),
                savedSemester.getType()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SemesterDTO> updateSemester(
            @PathVariable Integer id,
            @RequestBody SemesterDTO semesterDTO
    ) {
        Optional<Semester> semesterOpt = semesterRepository.findById(id);
        if (semesterOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Semester semester = semesterOpt.get();
        if (semesterDTO.getAcademicYear() != null) {
            semester.setAcademicYear(semesterDTO.getAcademicYear());
        }
        if (semesterDTO.getType() != null) {
            semester.setType(semesterDTO.getType());
        }

        Semester updatedSemester = semesterRepository.save(semester);
        return ResponseEntity.ok(new SemesterDTO(
                updatedSemester.getIdSemester(),
                updatedSemester.getAcademicYear(),
                updatedSemester.getType()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSemester(@PathVariable Integer id) {
        if (!semesterRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        semesterRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
