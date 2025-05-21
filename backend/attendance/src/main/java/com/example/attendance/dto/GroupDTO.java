package com.example.attendance.dto;

import lombok.Data;

@Data
public class GroupDTO {
    private Integer id;
    private String name;

    public GroupDTO(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}