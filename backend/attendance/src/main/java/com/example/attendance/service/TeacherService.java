package com.example.attendance.service;

import com.example.attendance.model.Subject;
import com.example.attendance.model.StudentGroup;
import com.example.attendance.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {
    private final EmployeeRepository employeeRepository;

    public TeacherService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Subject> getSubjectsByTeacher(Integer teacherId) {
        return employeeRepository.findSubjectsByTeacher(teacherId);
    }

    public List<StudentGroup> getGroupsByTeacherAndSubject(Integer teacherId, Integer subjectId) {
        return employeeRepository.findGroupsByTeacherAndSubject(teacherId, subjectId);
    }
}