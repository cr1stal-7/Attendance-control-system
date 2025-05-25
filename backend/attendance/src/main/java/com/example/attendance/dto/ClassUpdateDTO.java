package com.example.attendance.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClassUpdateDTO {
    private LocalDateTime datetime;
    private Integer classTypeId;
    private Integer classroomId;
    private Integer employeeId;
}