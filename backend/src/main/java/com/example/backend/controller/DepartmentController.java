package com.example.backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.DepartmentDTO;
import com.example.backend.entity.Department;
import com.example.backend.service.DepartmentService;

@RestController
@RequestMapping(path = "/api/department")
@CrossOrigin(origins = { "http://localhost:3000" })
public class DepartmentController {
    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<Iterable<Department>> getAllDepartment() {
        Iterable<Department> department = departmentService.getAllDepartment();
        return ResponseEntity.ok(department);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable int id) {
        Optional<Department> department = this.departmentService.getDepartmentById(id);
        return department.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody DepartmentDTO departmentDTO) {
        Department department = departmentService.createDepartment(departmentDTO);
        return ResponseEntity.ok(department);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable int id, @RequestBody DepartmentDTO departmentDTO) {
        try {
            Department updatedDepartment = departmentService.updateDepartment(id, departmentDTO);
            return ResponseEntity.ok(updatedDepartment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDepartment(@PathVariable int id) {
        try {
            boolean isDeleted = departmentService.deleteDepartment(id);
            if (isDeleted) {
                return ResponseEntity.ok("Xóa khoa thành công");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
