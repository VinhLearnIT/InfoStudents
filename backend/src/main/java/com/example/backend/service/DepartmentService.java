package com.example.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.DepartmentDTO;
import com.example.backend.entity.Department;
import com.example.backend.repository.ClassSDRepository;
import com.example.backend.repository.DepartmentRepository;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ClassSDRepository classSDRepository;

    public Iterable<Department> getAllDepartment() {
        return departmentRepository.findAll();
    }

    public Optional<Department> getDepartmentById(int id) {
        return departmentRepository.findById(id);
    }

    public Department createDepartment(DepartmentDTO dto) {
        Department department = new Department();
        department.setDepname(dto.getDepname());
        return departmentRepository.save(department);
    }

    public Department updateDepartment(int id, DepartmentDTO dto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy"));
        department.setDepname(dto.getDepname());
        return departmentRepository.save(department);
    }

    public boolean deleteDepartment(int id) {
        if (classSDRepository.existsByDepartmentId(id)) {
            throw new RuntimeException("Không thể xóa, khoa này đã có lớp học.");
        }

        if (departmentRepository.existsById(id)) {
            departmentRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
