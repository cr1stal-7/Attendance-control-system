package com.example.attendance.controller;

import com.example.attendance.dto.RoleDTO;
import com.example.attendance.model.Role;
import com.example.attendance.repository.RoleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/accounts/roles")
public class RoleController {

    private final RoleRepository roleRepository;

    public RoleController(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        List<RoleDTO> roleDTOs = roles.stream()
                .map(s -> new RoleDTO(s.getIdRole(), s.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(roleDTOs);
    }

    @PostMapping
    public ResponseEntity<RoleDTO> createRole(@RequestBody RoleDTO roleDTO) {
        if (roleDTO.getName() == null) {
            return ResponseEntity.badRequest().build();
        }
        Role role = new Role();
        role.setName(roleDTO.getName());
        Role savedRole = roleRepository.save(role);
        return ResponseEntity.ok(new RoleDTO(
                savedRole.getIdRole(),
                savedRole.getName()
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleDTO> updateRole(
            @PathVariable Integer id,
            @RequestBody RoleDTO roleDTO
    ) {
        Optional<Role> roleOpt = roleRepository.findById(id);
        if (roleOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Role role = roleOpt.get();
        if (roleDTO.getName() != null) {
            role.setName(roleDTO.getName());
        }

        Role updatedRole = roleRepository.save(role);
        return ResponseEntity.ok(new RoleDTO(
                updatedRole.getIdRole(),
                updatedRole.getName()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Integer id) {
        if (!roleRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        roleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}