package com.example.attendance.controller;

import com.example.attendance.dto.AttendanceStatusDTO;
import com.example.attendance.model.AttendanceStatus;
import com.example.attendance.repository.AttendanceStatusRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/attendance/statuses")
public class AttendanceStatusController {

    private final AttendanceStatusRepository attendanceStatusRepository;

    public AttendanceStatusController(AttendanceStatusRepository attendanceStatusRepository) {
        this.attendanceStatusRepository = attendanceStatusRepository;
    }

    @GetMapping
    public ResponseEntity<List<AttendanceStatusDTO>> getAllAttendanceStatuss() {
        List<AttendanceStatus> attendanceStatuss = attendanceStatusRepository.findAll();
        List<AttendanceStatusDTO> attendanceStatusDTOs = attendanceStatuss.stream()
                .map(s -> new AttendanceStatusDTO(s.getIdStatus(), s.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(attendanceStatusDTOs);
    }

    @PostMapping
    public ResponseEntity<AttendanceStatusDTO> createAttendanceStatus(@RequestBody AttendanceStatusDTO attendanceStatusDTO) {
        if (attendanceStatusDTO.getName() == null) {
            return ResponseEntity.badRequest().build();
        }

        AttendanceStatus attendanceStatus = new AttendanceStatus();
        attendanceStatus.setName(attendanceStatusDTO.getName());

        AttendanceStatus savedAttendanceStatus = attendanceStatusRepository.save(attendanceStatus);
        return ResponseEntity.ok(new AttendanceStatusDTO(
                savedAttendanceStatus.getIdStatus(),
                savedAttendanceStatus.getName()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceStatusDTO> updateAttendanceStatus(
            @PathVariable Integer id,
            @RequestBody AttendanceStatusDTO attendanceStatusDTO
    ) {
        Optional<AttendanceStatus> attendanceStatusOpt = attendanceStatusRepository.findById(id);
        if (attendanceStatusOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AttendanceStatus attendanceStatus = attendanceStatusOpt.get();
        if (attendanceStatusDTO.getName() != null) {
            attendanceStatus.setName(attendanceStatusDTO.getName());
        }

        AttendanceStatus updatedAttendanceStatus = attendanceStatusRepository.save(attendanceStatus);
        return ResponseEntity.ok(new AttendanceStatusDTO(
                updatedAttendanceStatus.getIdStatus(),
                updatedAttendanceStatus.getName()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendanceStatus(@PathVariable Integer id) {
        if (!attendanceStatusRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        attendanceStatusRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
