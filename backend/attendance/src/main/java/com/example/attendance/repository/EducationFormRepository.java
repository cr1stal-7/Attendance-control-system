package com.example.attendance.repository;

import com.example.attendance.model.EducationForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EducationFormRepository extends JpaRepository<EducationForm, Integer> {
}

