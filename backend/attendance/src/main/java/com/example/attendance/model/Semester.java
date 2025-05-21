package com.example.attendance.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "semester")
@Data
public class Semester {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_semester")
    private Integer idSemester;

    @Column(name = "academic_year", nullable = false, length = 10)
    private String academicYear;

    @Column(name = "type", nullable = false, length = 20)
    private String type;

    @OneToMany(mappedBy = "semester")
    private List<CurriculumSubject> curriculumSubjects;
}