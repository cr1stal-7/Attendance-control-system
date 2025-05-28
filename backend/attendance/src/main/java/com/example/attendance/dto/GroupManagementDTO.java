package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GroupManagementDTO {
    private Integer idGroup;
    private String name;
    private Integer course;
    private Integer idDepartment;
    private String departmentName;
    private Integer idCurriculum;
    private String curriculumName;
}