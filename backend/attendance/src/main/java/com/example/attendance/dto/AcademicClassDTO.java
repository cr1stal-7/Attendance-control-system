package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AcademicClassDTO {
    private Integer id;
    private LocalDateTime date;
    private String type;
    private String subjectName;
    private String groupName;
    private String classroomNumber;
    private String employeeSurname;
    private String employeeName;
    private String employeeSecondName;
}