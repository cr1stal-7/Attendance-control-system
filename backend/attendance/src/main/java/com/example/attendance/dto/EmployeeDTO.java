package com.example.attendance.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
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

    public EmployeeDTO(Integer id, String surname, String name,
                      String secondName, LocalDate birthDate,
                       String email, Integer departmentId, String departmentName,
                       Integer positionId, String positionName, Integer roleId) {
        this.id = id;
        this.surname = surname;
        this.name = name;
        this.secondName = secondName;
        this.birthDate = birthDate;
        this.email = email;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.positionId = positionId;
        this.positionName = positionName;
        this.roleId = roleId;
    }
}
