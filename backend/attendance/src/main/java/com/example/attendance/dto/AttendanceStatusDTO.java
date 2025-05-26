package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AttendanceStatusDTO {
    private Integer idStatus;
    private String academicYear;
    private String type;
}

