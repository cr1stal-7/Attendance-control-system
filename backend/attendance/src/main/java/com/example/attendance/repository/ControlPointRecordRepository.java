package com.example.attendance.repository;

import com.example.attendance.model.ControlPointRecord;
import com.example.attendance.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ControlPointRecordRepository extends JpaRepository<ControlPointRecord, Integer> {
    Optional<ControlPointRecord> findTopByStudentAndDirectionOrderByDatetimeDesc(
            Student student,
            String direction
    );
}