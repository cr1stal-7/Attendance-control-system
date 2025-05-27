package com.example.attendance.controller;

import com.example.attendance.dto.SubjectDTO;
import com.example.attendance.model.Subject;
import com.example.attendance.repository.SubjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/education/subjects")
public class SubjectController {

    private final SubjectRepository subjectRepository;

    public SubjectController(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @GetMapping
    public ResponseEntity<List<SubjectDTO>> getAllSubjects() {
        List<Subject> subjects = subjectRepository.findAll();
        List<SubjectDTO> subjectDTOs = subjects.stream()
                .map(s -> new SubjectDTO(s.getIdSubject(), s.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(subjectDTOs);
    }

    @PostMapping
    public ResponseEntity<SubjectDTO> createSubject(@RequestBody SubjectDTO subjectDTO) {
        if (subjectDTO.getName() == null) {
            return ResponseEntity.badRequest().build();
        }

        Subject subject = new Subject();
        subject.setName(subjectDTO.getName());

        Subject savedSubject = subjectRepository.save(subject);
        return ResponseEntity.ok(new SubjectDTO(
                savedSubject.getIdSubject(),
                savedSubject.getName()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubjectDTO> updateSubject(
            @PathVariable Integer id,
            @RequestBody SubjectDTO subjectDTO
    ) {
        Optional<Subject> subjectOpt = subjectRepository.findById(id);
        if (subjectOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Subject subject = subjectOpt.get();
        if (subjectDTO.getName() != null) {
            subject.setName(subjectDTO.getName());
        }

        Subject updatedSubject = subjectRepository.save(subject);
        return ResponseEntity.ok(new SubjectDTO(
                updatedSubject.getIdSubject(),
                updatedSubject.getName()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Integer id) {
        if (!subjectRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        subjectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
