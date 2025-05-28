package com.example.attendance.controller;

import com.example.attendance.dto.CurriculumDTO;
import com.example.attendance.model.Curriculum;
import com.example.attendance.repository.CurriculumRepository;
import com.example.attendance.repository.EducationFormRepository;
import com.example.attendance.repository.SpecializationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/education/curriculums")
public class CurriculumController {

    private final CurriculumRepository curriculumRepository;
    private final SpecializationRepository specializationRepository;
    private final EducationFormRepository educationFormRepository;

    public CurriculumController(CurriculumRepository curriculumRepository,
                                          SpecializationRepository specializationRepository,
                                          EducationFormRepository educationFormRepository) {
        this.curriculumRepository = curriculumRepository;
        this.specializationRepository = specializationRepository;
        this.educationFormRepository = educationFormRepository;
    }

    @GetMapping
    public ResponseEntity<List<CurriculumDTO>> getAllCurricula(
            @RequestParam(required = false) Integer specializationId,
            @RequestParam(required = false) Integer educationFormId) {

        List<Curriculum> curricula;

        if (specializationId != null && educationFormId != null) {
            curricula = curriculumRepository.findBySpecializationIdSpecializationAndEducationFormIdEducationForm(
                    specializationId, educationFormId);
        } else if (specializationId != null) {
            curricula = curriculumRepository.findBySpecializationIdSpecialization(specializationId);
        } else if (educationFormId != null) {
            curricula = curriculumRepository.findByEducationFormIdEducationForm(educationFormId);
        } else {
            curricula = curriculumRepository.findAll();
        }

        List<CurriculumDTO> curriculumDTOs = curricula.stream()
                .map(c -> new CurriculumDTO(
                        c.getIdCurriculum(),
                        c.getName(),
                        c.getAcademicYear(),
                        c.getDuration(),
                        c.getSpecialization().getIdSpecialization(),
                        c.getSpecialization().getName(),
                        c.getEducationForm().getIdEducationForm(),
                        c.getEducationForm().getName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(curriculumDTOs);
    }

    @PostMapping
    public ResponseEntity<CurriculumDTO> createCurriculum(@RequestBody CurriculumDTO curriculumDTO) {
        if (curriculumDTO.getName() == null || curriculumDTO.getAcademicYear() == null ||
                curriculumDTO.getDuration() == null || curriculumDTO.getIdSpecialization() == null ||
                curriculumDTO.getIdEducationForm() == null) {
            return ResponseEntity.badRequest().build();
        }

        Curriculum curriculum = new Curriculum();
        curriculum.setName(curriculumDTO.getName());
        curriculum.setAcademicYear(curriculumDTO.getAcademicYear());
        curriculum.setDuration(curriculumDTO.getDuration());

        specializationRepository.findById(curriculumDTO.getIdSpecialization())
                .ifPresent(curriculum::setSpecialization);
        educationFormRepository.findById(curriculumDTO.getIdEducationForm())
                .ifPresent(curriculum::setEducationForm);

        Curriculum savedCurriculum = curriculumRepository.save(curriculum);
        return ResponseEntity.ok(new CurriculumDTO(
                savedCurriculum.getIdCurriculum(),
                savedCurriculum.getName(),
                savedCurriculum.getAcademicYear(),
                savedCurriculum.getDuration(),
                savedCurriculum.getSpecialization().getIdSpecialization(),
                savedCurriculum.getSpecialization().getName(),
                savedCurriculum.getEducationForm().getIdEducationForm(),
                savedCurriculum.getEducationForm().getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CurriculumDTO> updateCurriculum(
            @PathVariable Integer id,
            @RequestBody CurriculumDTO curriculumDTO) {
        Optional<Curriculum> curriculumOpt = curriculumRepository.findById(id);
        if (curriculumOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Curriculum curriculum = curriculumOpt.get();
        if (curriculumDTO.getName() != null) {
            curriculum.setName(curriculumDTO.getName());
        }
        if (curriculumDTO.getAcademicYear() != null) {
            curriculum.setAcademicYear(curriculumDTO.getAcademicYear());
        }
        if (curriculumDTO.getDuration() != null) {
            curriculum.setDuration(curriculumDTO.getDuration());
        }
        if (curriculumDTO.getIdSpecialization() != null) {
            specializationRepository.findById(curriculumDTO.getIdSpecialization())
                    .ifPresent(curriculum::setSpecialization);
        }
        if (curriculumDTO.getIdEducationForm() != null) {
            educationFormRepository.findById(curriculumDTO.getIdEducationForm())
                    .ifPresent(curriculum::setEducationForm);
        }

        Curriculum updatedCurriculum = curriculumRepository.save(curriculum);
        return ResponseEntity.ok(new CurriculumDTO(
                updatedCurriculum.getIdCurriculum(),
                updatedCurriculum.getName(),
                updatedCurriculum.getAcademicYear(),
                updatedCurriculum.getDuration(),
                updatedCurriculum.getSpecialization().getIdSpecialization(),
                updatedCurriculum.getSpecialization().getName(),
                updatedCurriculum.getEducationForm().getIdEducationForm(),
                updatedCurriculum.getEducationForm().getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCurriculum(@PathVariable Integer id) {
        if (!curriculumRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        curriculumRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}