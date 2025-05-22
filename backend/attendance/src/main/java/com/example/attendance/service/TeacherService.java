package com.example.attendance.service;

import com.example.attendance.model.*;
        import com.example.attendance.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {
    private final EmployeeRepository employeeRepository;

    public TeacherService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Semester> getSemestersByTeacher(Integer teacherId) {
        return employeeRepository.findSemestersByTeacher(teacherId);
    }

    public List<Subject> getSubjectsByTeacherAndSemester(Integer teacherId, Integer semesterId) {
        return employeeRepository.findSubjectsByTeacherAndSemester(teacherId, semesterId);
    }

    public List<StudentGroup> getGroupsByTeacherAndSubjectAndSemester(
            Integer teacherId, Integer subjectId, Integer semesterId) {
        return employeeRepository.findGroupsByTeacherAndSubjectAndSemester(
                teacherId, subjectId, semesterId);
    }

    public boolean isTeacherAssignedToGroupSubjectSemester(
            Integer teacherId, Integer groupId, Integer subjectId, Integer semesterId) {
        return employeeRepository.isTeacherAssignedToGroupSubjectSemester(
                teacherId, groupId, subjectId, semesterId);
    }
}