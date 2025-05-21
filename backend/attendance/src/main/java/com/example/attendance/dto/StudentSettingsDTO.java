package com.example.attendance.dto;

import lombok.Data;

@Data
public class StudentSettingsDTO {
    private String surname;
    private String name;
    private String secondName;
    private String email;
    private Integer studentCardId;
    private String group;
    private Integer course;
    private String department;
    private String specialization;
    private String educationForm;
}