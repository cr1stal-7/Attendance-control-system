package com.example.attendance.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "control_point")
@Data
public class ControlPoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_control_point")
    private Integer idControlPoint;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @ManyToOne
    @JoinColumn(name = "id_building")
    private Building building;

    @OneToMany(mappedBy = "controlPoint")
    private List<ControlPointRecord> records;
}