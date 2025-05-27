package com.example.attendance.controller;

import com.example.attendance.dto.EducationFormDTO;
import com.example.attendance.model.EducationForm;
import com.example.attendance.repository.EducationFormRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/education/study-forms")
public class EducationFormController {

    private final EducationFormRepository educationFormRepository;

    public EducationFormController(EducationFormRepository educationFormRepository) {
        this.educationFormRepository = educationFormRepository;
    }

    @GetMapping
    public ResponseEntity<List<EducationFormDTO>> getAllEducationForms() {
        List<EducationForm> educationForms = educationFormRepository.findAll();
        List<EducationFormDTO> educationFormDTOs = educationForms.stream()
                .map(s -> new EducationFormDTO(s.getIdEducationForm(), s.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(educationFormDTOs);
    }

    @PostMapping
    public ResponseEntity<EducationFormDTO> createEducationForm(@RequestBody EducationFormDTO educationFormDTO) {
        if (educationFormDTO.getName() == null) {
            return ResponseEntity.badRequest().build();
        }

        EducationForm educationForm = new EducationForm();
        educationForm.setName(educationFormDTO.getName());

        EducationForm savedEducationForm = educationFormRepository.save(educationForm);
        return ResponseEntity.ok(new EducationFormDTO(
                savedEducationForm.getIdEducationForm(),
                savedEducationForm.getName()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EducationFormDTO> updateEducationForm(
            @PathVariable Integer id,
            @RequestBody EducationFormDTO educationFormDTO
    ) {
        Optional<EducationForm> educationFormOpt = educationFormRepository.findById(id);
        if (educationFormOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        EducationForm educationForm = educationFormOpt.get();
        if (educationFormDTO.getName() != null) {
            educationForm.setName(educationFormDTO.getName());
        }

        EducationForm updatedEducationForm = educationFormRepository.save(educationForm);
        return ResponseEntity.ok(new EducationFormDTO(
                updatedEducationForm.getIdEducationForm(),
                updatedEducationForm.getName()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducationForm(@PathVariable Integer id) {
        if (!educationFormRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        educationFormRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
