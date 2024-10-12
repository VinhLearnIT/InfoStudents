package com.example.backend.repository;

import org.springframework.data.repository.CrudRepository;
import com.example.backend.entity.Majors;

public interface MajorsRepository extends CrudRepository<Majors, Integer>{
    
}
