package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentAttendanceDTO {
    private Integer studentId;
    private String lastName;
    private String firstName;
    private String middleName;
    private Integer totalClasses;
    private Integer missedClasses;
    private Integer percentage;
}