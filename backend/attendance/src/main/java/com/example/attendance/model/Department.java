package com.example.attendance.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "department")
@Data
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_department")
    private Integer idDepartment;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "short_name", nullable = false, length = 20)
    private String shortName;

    @ManyToOne
    @JoinColumn(name = "fk_id_department")
    private Department parentDepartment;

    @OneToMany(mappedBy = "parentDepartment")
    @JsonIgnore
    private List<Department> childDepartments;

    @OneToMany(mappedBy = "department")
    @JsonIgnore
    private List<Employee> employees;

    @OneToMany(mappedBy = "department")
    @JsonIgnore
    private List<StudentGroup> studentGroups;
}