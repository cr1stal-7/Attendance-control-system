package com.example.attendance.repository;

import com.example.attendance.model.ClassType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassTypeRepository extends JpaRepository<ClassType, Integer> {
}