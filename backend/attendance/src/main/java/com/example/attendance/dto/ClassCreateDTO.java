package com.example.attendance.dto;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
public class ClassCreateDTO {
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime datetime;
    private Integer curriculumSubjectId;
    private Integer groupId;
    private Integer classTypeId;
    private Integer classroomId;
    private Integer employeeId;
}