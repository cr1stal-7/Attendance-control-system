package com.example.attendance.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class AcademicClassManagementDTO {
    private Integer idClass;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
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