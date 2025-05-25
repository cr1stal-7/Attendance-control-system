package com.example.attendance.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "curriculum")
@Data
public class Curriculum {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_curriculum")
    private Integer idCurriculum;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "academic_year", nullable = false, length = 10)
    private String academicYear;

    @Column(name = "duration", nullable = false)
    private Integer duration;

    @ManyToOne
    @JoinColumn(name = "id_education_form")
    @JsonIgnore
    private EducationForm educationForm;

    @ManyToOne
    @JoinColumn(name = "id_specialization")
    private Specialization specialization;

    @OneToMany(mappedBy = "curriculum")
    private List<StudentGroup> studentGroups;

    @OneToMany(mappedBy = "curriculum", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CurriculumSubject> curriculumSubjects;
}