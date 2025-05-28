package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DepartmentManagementDTO {
    private Integer idDepartment;
    private String name;
    private String shortName;
    private Integer parentId;
    private String parentName;
}
