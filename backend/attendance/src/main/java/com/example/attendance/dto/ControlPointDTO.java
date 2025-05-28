package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ControlPointDTO {
    private Integer idControlPoint;
    private String name;
    private Integer idBuilding;
    private String buildingName;
}
