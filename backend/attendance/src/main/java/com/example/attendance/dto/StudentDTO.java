package com.example.attendance.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentDTO {
    private Integer id;
    private String surname;
    private String name;
    private String secondName;
    private String email;
    private Integer studentCardId;
    private LocalDate birthDate;

    public StudentDTO(Integer id, String surname, String name,
                      String secondName, String email, Integer studentCardId, LocalDate birthDate) {
        this.id = id;
        this.surname = surname;
        this.name = name;
        this.secondName = secondName;
        this.email = email;
        this.studentCardId = studentCardId;
        this.birthDate = birthDate;
    }
}
