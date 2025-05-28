package com.example.attendance.controller;

import com.example.attendance.dto.ControlPointDTO;
import com.example.attendance.model.ControlPoint;
import com.example.attendance.repository.BuildingRepository;
import com.example.attendance.repository.ControlPointRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/attendance/control-points")
public class ControlPointController {

    private final ControlPointRepository controlPointRepository;
    private final BuildingRepository buildingRepository;

    public ControlPointController(ControlPointRepository controlPointRepository, BuildingRepository buildingRepository) {
        this.controlPointRepository = controlPointRepository;
        this.buildingRepository = buildingRepository;
    }

    @GetMapping
    public ResponseEntity<List<ControlPointDTO>> getAllControlPoints(@RequestParam(required = false) Integer buildingId) {
        List<ControlPoint> controlPoints;

        if (buildingId != null) {
            controlPoints = controlPointRepository.findByBuildingIdBuilding(buildingId);
        } else {
            controlPoints = controlPointRepository.findAll();
        }

        List<ControlPointDTO> controlPointDTOs = controlPoints.stream()
                .map(c -> new ControlPointDTO(
                        c.getIdControlPoint(),
                        c.getName(),
                        c.getBuilding().getIdBuilding(),
                        c.getBuilding().getName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(controlPointDTOs);
    }

    @PostMapping
    public ResponseEntity<ControlPointDTO> createControlPoint(@RequestBody ControlPointDTO controlPointDTO) {
        if (controlPointDTO.getName() == null || controlPointDTO.getIdBuilding() == null) {
            return ResponseEntity.badRequest().build();
        }

        ControlPoint controlPoint = new ControlPoint();
        controlPoint.setName(controlPointDTO.getName());

        buildingRepository.findById(controlPointDTO.getIdBuilding()).ifPresent(controlPoint::setBuilding);

        ControlPoint savedControlPoint = controlPointRepository.save(controlPoint);
        return ResponseEntity.ok(new ControlPointDTO(
                savedControlPoint.getIdControlPoint(),
                savedControlPoint.getName(),
                savedControlPoint.getBuilding().getIdBuilding(),
                savedControlPoint.getBuilding().getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ControlPointDTO> updateControlPoint(
            @PathVariable Integer id,
            @RequestBody ControlPointDTO controlPointDTO) {
        Optional<ControlPoint> controlPointOpt = controlPointRepository.findById(id);
        if (controlPointOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ControlPoint controlPoint = controlPointOpt.get();
        if (controlPointDTO.getName() != null) {
            controlPoint.setName(controlPointDTO.getName());
        }
        if (controlPointDTO.getIdBuilding() != null) {
            buildingRepository.findById(controlPointDTO.getIdBuilding()).ifPresent(controlPoint::setBuilding);
        }

        ControlPoint updatedControlPoint = controlPointRepository.save(controlPoint);
        return ResponseEntity.ok(new ControlPointDTO(
                updatedControlPoint.getIdControlPoint(),
                updatedControlPoint.getName(),
                updatedControlPoint.getBuilding().getIdBuilding(),
                updatedControlPoint.getBuilding().getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteControlPoint(@PathVariable Integer id) {
        if (!controlPointRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        controlPointRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}