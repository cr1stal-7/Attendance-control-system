package com.example.attendance.controller;

import com.example.attendance.dto.BuildingDTO;
import com.example.attendance.model.Building;
import com.example.attendance.repository.BuildingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/structure/buildings")
public class BuildingController {

    private final BuildingRepository buildingRepository;

    public BuildingController(BuildingRepository buildingRepository) {
        this.buildingRepository = buildingRepository;
    }

    @GetMapping
    public ResponseEntity<List<BuildingDTO>> getAllBuildings() {
        List<Building> buildings = buildingRepository.findAll();
        List<BuildingDTO> buildingDTOs = buildings.stream()
                .map(s -> new BuildingDTO(s.getIdBuilding(), s.getAddress(), s.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(buildingDTOs);
    }

    @PostMapping
    public ResponseEntity<BuildingDTO> createBuilding(@RequestBody BuildingDTO buildingDTO) {
        if (buildingDTO.getAddress() == null || buildingDTO.getName() == null) {
            return ResponseEntity.badRequest().build();
        }

        Building building = new Building();
        building.setAddress(buildingDTO.getAddress());
        building.setName(buildingDTO.getName());

        Building savedBuilding = buildingRepository.save(building);
        return ResponseEntity.ok(new BuildingDTO(
                savedBuilding.getIdBuilding(),
                savedBuilding.getAddress(),
                savedBuilding.getName()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BuildingDTO> updateBuilding(
            @PathVariable Integer id,
            @RequestBody BuildingDTO buildingDTO
    ) {
        Optional<Building> buildingOpt = buildingRepository.findById(id);
        if (buildingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Building building = buildingOpt.get();
        if (buildingDTO.getAddress() != null) {
            building.setAddress(buildingDTO.getAddress());
        }
        if (buildingDTO.getName() != null) {
            building.setName(buildingDTO.getName());
        }

        Building updatedBuilding = buildingRepository.save(building);
        return ResponseEntity.ok(new BuildingDTO(
                updatedBuilding.getIdBuilding(),
                updatedBuilding.getAddress(),
                updatedBuilding.getName()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBuilding(@PathVariable Integer id) {
        if (!buildingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        buildingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}