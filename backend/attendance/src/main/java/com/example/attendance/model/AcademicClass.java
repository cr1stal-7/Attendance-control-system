package com.example.attendance.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "class")
@Data
public class AcademicClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_class")
    private Integer idClass;

    @Column(name = "datetime", nullable = false)
    private LocalDateTime datetime;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "id_curriculum_subject", referencedColumnName = "id_curriculum_subject"),
            @JoinColumn(name = "id_curriculum", referencedColumnName = "id_curriculum")
    })
    private CurriculumSubject curriculumSubject;

    @ManyToOne
    @JoinColumn(name = "id_class_type")
    private ClassType classType;

    @ManyToOne
    @JoinColumn(name = "id_classroom")
    private Classroom classroom;

    @ManyToOne
    @JoinColumn(name = "id_employee")
    private Employee employee;

    @OneToMany(mappedBy = "classEntity")
    private List<Attendance> attendances;

    @ManyToMany(mappedBy = "classes")
    @JsonIgnore
    private List<StudentGroup> groups;
}