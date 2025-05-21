package com.example.attendance.model;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "curriculum_subject")
@Data
public class CurriculumSubject {
    @EmbeddedId
    private CurriculumSubjectId id;

    @Column(name = "hours", nullable = false)
    private Integer hours;

    @ManyToOne
    @JoinColumn(name = "id_subject", insertable = false, updatable = false)
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "id_semester", insertable = false, updatable = false)
    private Semester semester;

    @ManyToOne
    @MapsId("idCurriculum")
    @JoinColumn(name = "id_curriculum")
    private Curriculum curriculum;

    @OneToMany(mappedBy = "curriculumSubject")
    private List<AcademicClass> classes;
}

@Embeddable
@Data
class CurriculumSubjectId implements Serializable {
    @Column(name = "id_curriculum_subject")
    private Integer idCurriculumSubject;

    @Column(name = "id_curriculum")
    private Integer idCurriculum;
}