package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SemesterDTO {
    private Integer idSemester;
    private String academicYear;
    private String type;
}
