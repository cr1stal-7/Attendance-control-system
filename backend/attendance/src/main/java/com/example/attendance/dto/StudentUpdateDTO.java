package com.example.attendance.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentUpdateDTO {
    private String surname;
    private String name;
    private String secondName;
    private LocalDate birthDate;
    private String password;
    private String email;
    private Integer studentCardId;
}
