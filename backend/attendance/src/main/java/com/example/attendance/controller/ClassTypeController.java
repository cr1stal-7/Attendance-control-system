package com.example.attendance.controller;

import com.example.attendance.model.ClassType;
import com.example.attendance.repository.ClassTypeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/staff/class-types")
public class ClassTypeController {
    private final ClassTypeRepository classTypeRepository;

    public ClassTypeController(ClassTypeRepository classTypeRepository) {
        this.classTypeRepository = classTypeRepository;
    }

    @GetMapping
    public ResponseEntity<List<ClassType>> getAllClassTypes() {
        return ResponseEntity.ok(classTypeRepository.findAll());
    }
}