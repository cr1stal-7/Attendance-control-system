package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ClassroomDTO {
    private Integer idClassroom;
    private Integer number;
    private Integer floor;
    private Integer idBuilding;
    private String buildingName;
}