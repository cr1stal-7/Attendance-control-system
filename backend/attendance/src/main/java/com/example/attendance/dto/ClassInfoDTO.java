package com.example.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ClassInfoDTO {
    private Integer idClass;
    private LocalDateTime date;
    private String topic;
    private String subjectName;
    private String groupName;
}
