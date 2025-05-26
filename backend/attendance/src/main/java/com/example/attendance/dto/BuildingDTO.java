package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BuildingDTO {
    private Integer idBuilding;
    private String address;
    private String name;
}