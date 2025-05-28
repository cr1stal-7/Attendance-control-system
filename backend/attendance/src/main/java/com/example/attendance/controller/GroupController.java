package com.example.attendance.controller;

import com.example.attendance.dto.GroupManagementDTO;
import com.example.attendance.model.*;
import com.example.attendance.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/education/groups")
public class GroupController {

    private final GroupRepository groupRepository;
    private final DepartmentRepository departmentRepository;
    private final CurriculumRepository curriculumRepository;

    public GroupController(GroupRepository groupRepository,
                                     DepartmentRepository departmentRepository,
                                     CurriculumRepository curriculumRepository) {
        this.groupRepository = groupRepository;
        this.departmentRepository = departmentRepository;
        this.curriculumRepository = curriculumRepository;
    }

    @GetMapping
    public ResponseEntity<List<GroupManagementDTO>> getAllGroups(
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) Integer curriculumId) {

        List<StudentGroup> groups;

        if (departmentId != null && curriculumId != null) {
            groups = groupRepository.findByDepartmentIdDepartmentAndCurriculumIdCurriculum(departmentId, curriculumId);
        } else if (departmentId != null) {
            groups = groupRepository.findByDepartmentIdDepartment(departmentId);
        } else if (curriculumId != null) {
            groups = groupRepository.findByCurriculumIdCurriculum(curriculumId);
        } else {
            groups = groupRepository.findAll();
        }

        List<GroupManagementDTO> groupDTOs = groups.stream()
                .map(g -> new GroupManagementDTO(
                        g.getIdGroup(),
                        g.getName(),
                        g.getCourse(),
                        g.getDepartment().getIdDepartment(),
                        g.getDepartment().getName(),
                        g.getCurriculum().getIdCurriculum(),
                        g.getCurriculum().getName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(groupDTOs);
    }

    @PostMapping
    public ResponseEntity<GroupManagementDTO> createGroup(@RequestBody GroupManagementDTO groupDTO) {
        if (groupDTO.getName() == null || groupDTO.getCourse() == null ||
                groupDTO.getIdDepartment() == null || groupDTO.getIdCurriculum() == null) {
            return ResponseEntity.badRequest().build();
        }

        StudentGroup group = new StudentGroup();
        group.setName(groupDTO.getName());
        group.setCourse(groupDTO.getCourse());

        departmentRepository.findById(groupDTO.getIdDepartment()).ifPresent(group::setDepartment);
        curriculumRepository.findById(groupDTO.getIdCurriculum()).ifPresent(group::setCurriculum);

        StudentGroup savedGroup = groupRepository.save(group);
        return ResponseEntity.ok(mapToDTO(savedGroup));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupManagementDTO> updateGroup(
            @PathVariable Integer id,
            @RequestBody GroupManagementDTO groupDTO) {

        Optional<StudentGroup> groupOpt = groupRepository.findById(id);
        if (groupOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        StudentGroup group = groupOpt.get();
        if (groupDTO.getName() != null) {
            group.setName(groupDTO.getName());
        }
        if (groupDTO.getCourse() != null) {
            group.setCourse(groupDTO.getCourse());
        }
        if (groupDTO.getIdDepartment() != null) {
            departmentRepository.findById(groupDTO.getIdDepartment()).ifPresent(group::setDepartment);
        }
        if (groupDTO.getIdCurriculum() != null) {
            curriculumRepository.findById(groupDTO.getIdCurriculum()).ifPresent(group::setCurriculum);
        }

        StudentGroup updatedGroup = groupRepository.save(group);
        return ResponseEntity.ok(mapToDTO(updatedGroup));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Integer id) {
        if (!groupRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        groupRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private GroupManagementDTO mapToDTO(StudentGroup group) {
        return new GroupManagementDTO(
                group.getIdGroup(),
                group.getName(),
                group.getCourse(),
                group.getDepartment().getIdDepartment(),
                group.getDepartment().getName(),
                group.getCurriculum().getIdCurriculum(),
                group.getCurriculum().getName());
    }
}