package com.example.attendance.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "role")
@Data
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_role")
    private Integer idRole;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @OneToMany(mappedBy = "role")
    @JsonIgnore
    private List<Employee> employees;
}