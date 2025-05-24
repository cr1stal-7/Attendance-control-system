package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentAttendanceFormDTO {
    private Integer studentId;
    private String surname;
    private String name;
    private String secondName;
    private String status;
}
