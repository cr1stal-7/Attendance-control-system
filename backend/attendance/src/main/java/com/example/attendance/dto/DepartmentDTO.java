package com.example.attendance.dto;

import lombok.Data;

@Data
public class DepartmentDTO {
    private Integer id;
    private String name;

    public DepartmentDTO(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}