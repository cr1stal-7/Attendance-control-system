package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class EmployeeManagementDTO {
    private Integer idEmployee;
    private String surname;
    private String name;
    private String secondName;
    private LocalDate birthDate;
    private String email;
    private String password;
    private Integer idDepartment;
    private String departmentName;
    private Integer idPosition;
    private String positionName;
    private Integer idRole;
    private String roleName;
}