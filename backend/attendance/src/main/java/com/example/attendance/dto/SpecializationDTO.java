package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SpecializationDTO {
    private Integer idSpecialization;
    private String name;
    private String code;
}