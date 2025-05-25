package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class EmployeeDTO {
    private Integer id;
    private String surname;
    private String name;
    private String secondName;
    private LocalDate birthDate;
    private String email;
    private Integer departmentId;
    private String departmentName;
    private Integer positionId;
    private String positionName;
    private Integer roleId;
}
