package com.example.attendance.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EmployeeUpdateDTO {
    private String surname;
    private String name;
    private String secondName;
    private LocalDate birthDate;
    private String email;
    private String password;
    private Integer departmentId;
    private Integer positionId;
    private Integer roleId;
}

