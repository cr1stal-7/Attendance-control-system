package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class StudentDTO {
    private Integer id;
    private String surname;
    private String name;
    private String secondName;
    private String email;
    private Integer studentCardId;
    private LocalDate birthDate;
}
