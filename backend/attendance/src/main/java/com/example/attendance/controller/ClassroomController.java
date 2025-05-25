package com.example.attendance.controller;

import com.example.attendance.model.Classroom;
import com.example.attendance.repository.ClassroomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/staff/classrooms")
public class ClassroomController {
    private final ClassroomRepository classroomRepository;

    public ClassroomController(ClassroomRepository classroomRepository) {
        this.classroomRepository = classroomRepository;
    }

    @GetMapping
    public ResponseEntity<List<Classroom>> getAllClassrooms() {
        return ResponseEntity.ok(classroomRepository.findAll());
    }
}