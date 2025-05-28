package com.example.attendance.controller;

import com.example.attendance.dto.ClassroomDTO;
import com.example.attendance.model.Classroom;
import com.example.attendance.repository.BuildingRepository;
import com.example.attendance.repository.ClassroomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/structure/classrooms")
public class ClassroomManagementController {

    private final ClassroomRepository classroomRepository;
    private final BuildingRepository buildingRepository;

    public ClassroomManagementController(ClassroomRepository classroomRepository, BuildingRepository buildingRepository) {
        this.classroomRepository = classroomRepository;
        this.buildingRepository = buildingRepository;
    }

    @GetMapping
    public ResponseEntity<List<ClassroomDTO>> getAllClassrooms(@RequestParam(required = false) Integer buildingId) {
        List<Classroom> classrooms;

        if (buildingId != null) {
            classrooms = classroomRepository.findByBuildingIdBuilding(buildingId);
        } else {
            classrooms = classroomRepository.findAll();
        }

        List<ClassroomDTO> classroomDTOs = classrooms.stream()
                .map(c -> new ClassroomDTO(
                        c.getIdClassroom(),
                        c.getNumber(),
                        c.getFloor(),
                        c.getBuilding().getIdBuilding(),
                        c.getBuilding().getName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(classroomDTOs);
    }

    @PostMapping
    public ResponseEntity<ClassroomDTO> createClassroom(@RequestBody ClassroomDTO classroomDTO) {
        if (classroomDTO.getNumber() == null || classroomDTO.getFloor() == null || classroomDTO.getIdBuilding() == null) {
            return ResponseEntity.badRequest().build();
        }

        Classroom classroom = new Classroom();
        classroom.setNumber(classroomDTO.getNumber());
        classroom.setFloor(classroomDTO.getFloor());

        buildingRepository.findById(classroomDTO.getIdBuilding()).ifPresent(classroom::setBuilding);

        Classroom savedClassroom = classroomRepository.save(classroom);
        return ResponseEntity.ok(new ClassroomDTO(
                savedClassroom.getIdClassroom(),
                savedClassroom.getNumber(),
                savedClassroom.getFloor(),
                savedClassroom.getBuilding().getIdBuilding(),
                savedClassroom.getBuilding().getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassroomDTO> updateClassroom(
            @PathVariable Integer id,
            @RequestBody ClassroomDTO classroomDTO) {
        Optional<Classroom> classroomOpt = classroomRepository.findById(id);
        if (classroomOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Classroom classroom = classroomOpt.get();
        if (classroomDTO.getNumber() != null) {
            classroom.setNumber(classroomDTO.getNumber());
        }
        if (classroomDTO.getFloor() != null) {
            classroom.setFloor(classroomDTO.getFloor());
        }
        if (classroomDTO.getIdBuilding() != null) {
            buildingRepository.findById(classroomDTO.getIdBuilding()).ifPresent(classroom::setBuilding);
        }

        Classroom updatedClassroom = classroomRepository.save(classroom);
        return ResponseEntity.ok(new ClassroomDTO(
                updatedClassroom.getIdClassroom(),
                updatedClassroom.getNumber(),
                updatedClassroom.getFloor(),
                updatedClassroom.getBuilding().getIdBuilding(),
                updatedClassroom.getBuilding().getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassroom(@PathVariable Integer id) {
        if (!classroomRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        classroomRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}