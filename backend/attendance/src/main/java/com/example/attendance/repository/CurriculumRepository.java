package com.example.attendance.repository;

import com.example.attendance.model.Curriculum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CurriculumRepository extends JpaRepository<Curriculum, Integer> {
    List<Curriculum> findByEducationFormIdEducationForm(Integer educationFormId);

    List<Curriculum> findBySpecializationIdSpecialization(Integer specializationId);

    List<Curriculum> findBySpecializationIdSpecializationAndEducationFormIdEducationForm(Integer specializationId, Integer educationFormId);
}
