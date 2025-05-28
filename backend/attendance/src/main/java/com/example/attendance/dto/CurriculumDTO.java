package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CurriculumDTO {
    private Integer idCurriculum;
    private String name;
    private String academicYear;
    private Integer duration;
    private Integer idSpecialization;
    private String specializationName;
    private Integer idEducationForm;
    private String educationFormName;
}