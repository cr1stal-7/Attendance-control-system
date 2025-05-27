package com.example.attendance.controller;

import com.example.attendance.dto.PositionDTO;
import com.example.attendance.model.Position;
import com.example.attendance.repository.PositionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/structure/positions")
public class PositionController {

    private final PositionRepository positionRepository;

    public PositionController(PositionRepository positionRepository) {
        this.positionRepository = positionRepository;
    }

    @GetMapping
    public ResponseEntity<List<PositionDTO>> getAllPositions() {
        List<Position> positions = positionRepository.findAll();
        List<PositionDTO> positionDTOs = positions.stream()
                .map(s -> new PositionDTO(s.getIdPosition(), s.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(positionDTOs);
    }

    @PostMapping
    public ResponseEntity<PositionDTO> createPosition(@RequestBody PositionDTO positionDTO) {
        if (positionDTO.getName() == null) {
            return ResponseEntity.badRequest().build();
        }

        Position position = new Position();
        position.setName(positionDTO.getName());

        Position savedPosition = positionRepository.save(position);
        return ResponseEntity.ok(new PositionDTO(
                savedPosition.getIdPosition(),
                savedPosition.getName()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PositionDTO> updatePosition(
            @PathVariable Integer id,
            @RequestBody PositionDTO positionDTO
    ) {
        Optional<Position> positionOpt = positionRepository.findById(id);
        if (positionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Position position = positionOpt.get();
        if (positionDTO.getName() != null) {
            position.setName(positionDTO.getName());
        }

        Position updatedPosition = positionRepository.save(position);
        return ResponseEntity.ok(new PositionDTO(
                updatedPosition.getIdPosition(),
                updatedPosition.getName()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePosition(@PathVariable Integer id) {
        if (!positionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        positionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
