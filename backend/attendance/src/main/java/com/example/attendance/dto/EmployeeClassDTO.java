package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeeClassDTO {
    private Integer id;
    private String surname;
    private String name;
    private String secondName;
}