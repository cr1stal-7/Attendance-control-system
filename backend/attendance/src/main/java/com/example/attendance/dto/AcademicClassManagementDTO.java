package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collector;

@Data
@AllArgsConstructor
public class AcademicClassManagementDTO {
    private Integer idClass;
    private LocalDateTime datetime;
    private Integer idCurriculumSubject;
    private String subjectName;
    private Integer idClassType;
    private String classTypeName;
    private Integer idClassroom;
    private Integer classroomNumber;
    private Integer idEmployee;
    private String employeeName;
    private String groupNames;
    private List<Integer> groupIds;
}