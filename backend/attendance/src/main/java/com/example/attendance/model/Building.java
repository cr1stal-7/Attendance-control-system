package com.example.attendance.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "building")
@Data
public class Building {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_building")
    private Integer idBuilding;

    @Column(name = "address", nullable = false, length = 100)
    private String address;

    @Column(name = "name", nullable = false, length = 30)
    private String name;

    @OneToMany(mappedBy = "building")
    private List<Classroom> classrooms;

    @OneToMany(mappedBy = "building")
    private List<ControlPoint> controlPoints;
}