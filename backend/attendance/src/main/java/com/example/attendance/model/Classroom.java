package com.example.attendance.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "classroom")
@Data
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_classroom")
    private Integer idClassroom;

    @Column(name = "number", nullable = false, length = 10)
    private String number;

    @Column(name = "floor", nullable = false)
    private Integer floor;

    @ManyToOne
    @JoinColumn(name = "id_building")
    private Building building;

    @OneToMany(mappedBy = "classroom")
    private List<AcademicClass> classes;
}