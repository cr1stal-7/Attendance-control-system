package com.example.attendance.dto;

import lombok.Data;

@Data
public class PositionDTO {
    private Integer id;
    private String name;

    public PositionDTO(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}
