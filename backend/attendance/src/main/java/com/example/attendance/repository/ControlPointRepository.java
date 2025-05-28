package com.example.attendance.repository;

import com.example.attendance.model.ControlPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ControlPointRepository extends JpaRepository<ControlPoint, Integer> {
    List<ControlPoint> findByBuildingIdBuilding(Integer buildingId);
}

