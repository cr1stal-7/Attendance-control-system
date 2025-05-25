package com.example.attendance.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student_group")
@Data
public class StudentGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_group")
    private Integer idGroup;

    @Column(name = "name", nullable = false, length = 20)
    private String name;

    @Column(name = "course", nullable = false)
    private Integer course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_department")
    private Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_curriculum")
    private Curriculum curriculum;

    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Student> students;

    @ManyToMany(mappedBy = "groups")
    @JsonIgnore
    private List<AcademicClass> classes = new ArrayList<>();
}