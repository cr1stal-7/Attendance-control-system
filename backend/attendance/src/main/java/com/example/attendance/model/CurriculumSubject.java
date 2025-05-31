package com.example.attendance.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "curriculum_subject")
@Data
public class CurriculumSubject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_curriculum_subject")
    private Integer idCurriculumSubject;

    @Column(name = "hours", nullable = false)
    private Integer hours;

    @ManyToOne
    @JoinColumn(name = "id_subject")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "id_semester")
    private Semester semester;

    @ManyToOne
    @JoinColumn(name = "id_curriculum", nullable = false)
    private Curriculum curriculum;

    @OneToMany(mappedBy = "curriculumSubject", cascade = CascadeType.ALL)
    private List<AcademicClass> classes;
}