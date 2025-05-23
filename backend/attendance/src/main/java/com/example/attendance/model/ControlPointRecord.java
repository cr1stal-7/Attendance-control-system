package com.example.attendance.model;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "control_point_record")
@Data
public class ControlPointRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_record")
    private Integer idRecord;

    @Column(name = "datetime", nullable = false)
    private LocalDateTime datetime;

    @Column(name = "direction", nullable = false, length = 20)
    private String direction;

    @ManyToOne
    @JoinColumn(name = "id_control_point")
    private ControlPoint controlPoint;

    @ManyToOne
    @JoinColumn(name = "id_student", referencedColumnName = "id_student")
    private Student student;

    @OneToMany(mappedBy = "record")
    private List<Attendance> attendances;
}