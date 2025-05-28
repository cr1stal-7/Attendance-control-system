package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class StudentManagementDTO {
    private Integer idStudent;
    private String surname;
    private String name;
    private String secondName;
    private LocalDate birthDate;
    private String email;
    private Integer studentCardId;
    private String password;
    private Integer idGroup;
    private String groupName;
    private String departmentName;
}