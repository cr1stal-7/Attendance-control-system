package com.example.attendance.controller;

import com.example.attendance.dto.SpecializationDTO;
import com.example.attendance.model.Specialization;
import com.example.attendance.repository.SpecializationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/education/specializations")
public class SpecializationController {

    private final SpecializationRepository specializationRepository;

    public SpecializationController(SpecializationRepository specializationRepository) {
        this.specializationRepository = specializationRepository;
    }

    @GetMapping
    public ResponseEntity<List<SpecializationDTO>> getAllSpecializations() {
        List<Specialization> specializations = specializationRepository.findAll();
        List<SpecializationDTO> specializationDTOs = specializations.stream()
                .map(s -> new SpecializationDTO(s.getIdSpecialization(), s.getName(), s.getCode()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(specializationDTOs);
    }

    @PostMapping
    public ResponseEntity<SpecializationDTO> createSpecialization(@RequestBody SpecializationDTO specializationDTO) {
        if (specializationDTO.getName() == null || specializationDTO.getCode() == null) {
            return ResponseEntity.badRequest().build();
        }

        Specialization specialization = new Specialization();
        specialization.setName(specializationDTO.getName());
        specialization.setCode(specializationDTO.getCode());

        Specialization savedSpecialization = specializationRepository.save(specialization);
        return ResponseEntity.ok(new SpecializationDTO(
                savedSpecialization.getIdSpecialization(),
                savedSpecialization.getName(),
                savedSpecialization.getCode()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpecializationDTO> updateSpecialization(
            @PathVariable Integer id,
            @RequestBody SpecializationDTO specializationDTO
    ) {
        Optional<Specialization> specializationOpt = specializationRepository.findById(id);
        if (specializationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Specialization specialization = specializationOpt.get();
        if (specializationDTO.getName() != null) {
            specialization.setName(specializationDTO.getName());
        }
        if (specializationDTO.getCode() != null) {
            specialization.setCode(specializationDTO.getCode());
        }

        Specialization updatedSpecialization = specializationRepository.save(specialization);
        return ResponseEntity.ok(new SpecializationDTO(
                updatedSpecialization.getIdSpecialization(),
                updatedSpecialization.getName(),
                updatedSpecialization.getCode()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpecialization(@PathVariable Integer id) {
        if (!specializationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        specializationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}