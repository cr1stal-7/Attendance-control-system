package com.example.attendance.controller;

import com.example.attendance.dto.ClassTypeDTO;
import com.example.attendance.model.ClassType;
import com.example.attendance.repository.ClassTypeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/schedule/class-types")
public class ClassTypeManagementController {

    private final ClassTypeRepository classTypeRepository;

    public ClassTypeManagementController(ClassTypeRepository classTypeRepository) {
        this.classTypeRepository = classTypeRepository;
    }

    @GetMapping
    public ResponseEntity<List<ClassTypeDTO>> getAllClassTypes() {
        List<ClassType> classTypes = classTypeRepository.findAll();
        List<ClassTypeDTO> classTypeDTOs = classTypes.stream()
                .map(s -> new ClassTypeDTO(s.getIdClassType(), s.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(classTypeDTOs);
    }

    @PostMapping
    public ResponseEntity<ClassTypeDTO> createClassType(@RequestBody ClassTypeDTO classTypeDTO) {
        if (classTypeDTO.getName() == null) {
            return ResponseEntity.badRequest().build();
        }

        ClassType classType = new ClassType();
        classType.setName(classTypeDTO.getName());

        ClassType savedClassType = classTypeRepository.save(classType);
        return ResponseEntity.ok(new ClassTypeDTO(
                savedClassType.getIdClassType(),
                savedClassType.getName()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassTypeDTO> updateClassType(
            @PathVariable Integer id,
            @RequestBody ClassTypeDTO classTypeDTO
    ) {
        Optional<ClassType> classTypeOpt = classTypeRepository.findById(id);
        if (classTypeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ClassType classType = classTypeOpt.get();
        if (classTypeDTO.getName() != null) {
            classType.setName(classTypeDTO.getName());
        }

        ClassType updatedClassType = classTypeRepository.save(classType);
        return ResponseEntity.ok(new ClassTypeDTO(
                updatedClassType.getIdClassType(),
                updatedClassType.getName()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassType(@PathVariable Integer id) {
        if (!classTypeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        classTypeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
