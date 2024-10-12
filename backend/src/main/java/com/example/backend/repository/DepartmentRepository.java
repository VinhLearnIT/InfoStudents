package com.example.backend.repository;

import org.springframework.data.repository.CrudRepository;
import com.example.backend.entity.Department;

public interface DepartmentRepository extends CrudRepository<Department, Integer>{
    
}
