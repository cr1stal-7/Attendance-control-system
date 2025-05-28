package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CurriculumSubjectDTO {
    private Integer idCurriculumSubject;
    private Integer hours;
    private Integer idSubject;
    private String subjectName;
    private Integer idSemester;
    private String semesterName;
    private String semesterType;
    private Integer idCurriculum;
}
