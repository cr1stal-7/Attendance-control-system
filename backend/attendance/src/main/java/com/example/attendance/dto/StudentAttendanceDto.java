package com.example.attendance.dto;

import lombok.Data;

@Data
public class StudentAttendanceDto {
    private Integer studentId;
    private String lastName;
    private String firstName;
    private String middleName;
    private Integer totalClasses;
    private Integer missedClasses;
    private Integer percentage;
}