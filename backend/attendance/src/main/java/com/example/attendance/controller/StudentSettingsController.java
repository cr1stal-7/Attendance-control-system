package com.example.attendance.controller;

import com.example.attendance.dto.StudentSettingsDTO;
import com.example.attendance.model.Student;
import com.example.attendance.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/student/settings")
public class StudentSettingsController {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentSettingsController(StudentRepository studentRepository,
                                     PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<StudentSettingsDTO> getStudentInfo(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Student> student = studentRepository.findByEmailWithDetails(principal.getName());
        if (student.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Student studentEntity = student.get();
        StudentSettingsDTO response = new StudentSettingsDTO();

        // Личная информация
        response.setSurname(studentEntity.getSurname());
        response.setName(studentEntity.getName());
        response.setSecondName(studentEntity.getSecondName());
        response.setEmail(studentEntity.getEmail());
        response.setStudentCardId(studentEntity.getStudentCardId());

        // Информация о группе
        if (studentEntity.getGroup() != null) {
            response.setGroup(studentEntity.getGroup().getName());
            response.setCourse(studentEntity.getGroup().getCourse());

            if (studentEntity.getGroup().getDepartment() != null) {
                response.setDepartment(studentEntity.getGroup().getDepartment().getName());
            }

            if (studentEntity.getGroup().getCurriculum() != null) {
                // Получаем направление из учебного плана
                if (studentEntity.getGroup().getCurriculum().getSpecialization() != null) {
                    response.setSpecialization(studentEntity.getGroup().getCurriculum().getSpecialization().getName());
                }
                if (studentEntity.getGroup().getCurriculum().getEducationForm() != null) {
                    response.setEducationForm(studentEntity.getGroup().getCurriculum().getEducationForm().getName());
                }
            }
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestBody Map<String, String> request,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String newPassword = request.get("newPassword");
        String confirmPassword = request.get("confirmPassword");

        if (newPassword == null || confirmPassword == null || !newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Пароли не совпадают"));
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "Пароль должен содержать не менее 6 символов"));
        }

        Optional<Student> student = studentRepository.findByEmail(principal.getName());
        if (student.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Student studentEntity = student.get();
        studentEntity.setPassword(passwordEncoder.encode(newPassword));
        studentRepository.save(studentEntity);

        return ResponseEntity.ok(Map.of("message", "Пароль успешно изменен"));
    }
}