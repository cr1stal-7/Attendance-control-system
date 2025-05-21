package com.example.attendance.dto;

import lombok.Data;

@Data
public class SubjectDTO {
    private Integer id;
    private String name;

    public SubjectDTO(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}