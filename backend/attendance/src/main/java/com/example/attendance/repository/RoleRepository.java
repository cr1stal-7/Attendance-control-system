package com.example.attendance.repository;

import com.example.attendance.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    List<Role> findByNameNot(String admin);
}