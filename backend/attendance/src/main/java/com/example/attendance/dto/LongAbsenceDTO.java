package com.example.attendance.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class LongAbsenceDTO {
    private String surname;
    private String name;
    private String secondName;
    private String groupName;
    private LocalDate lastClassDate;
    private LocalDate lastDate;
}