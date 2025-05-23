package com.example.attendance.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "student")
@Data
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_student")
    private Integer idStudent;

    @Column(name = "surname", nullable = false, length = 50)
    private String surname;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "second_name", length = 50)
    private String secondName;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "student_card_id", nullable = false)
    private Integer studentCardId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_group")
    @JsonIgnore
    private StudentGroup group;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Attendance> attendances;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ControlPointRecord> controlPointRecords;
}