package com.example.attendance.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LongAbsenceDTO {
    private String surname;
    private String name;
    private String secondName;
    private String groupName;
    private LocalDateTime lastClassDate;
    private LocalDateTime lastDate;
}