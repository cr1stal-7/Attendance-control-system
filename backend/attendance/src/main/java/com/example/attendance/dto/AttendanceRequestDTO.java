package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AttendanceRequestDTO {
    private Integer studentId;
    private Integer classId;
    private String status;
}
