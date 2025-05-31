package com.example.attendance.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_attendance")
    private Integer idAttendance;

    @Column(name = "time", nullable = false)
    private LocalDateTime time;

    @ManyToOne
    @JoinColumn(name = "id_class")
    private AcademicClass classEntity;

    @ManyToOne
    @JoinColumn(name = "id_status")
    private AttendanceStatus status;

    @ManyToOne
    @JoinColumn(name = "id_student", nullable = false)
    private Student student;

    public boolean getPresent() {
        return status != null && "Присутствие".equals(status.getName());
    }
}