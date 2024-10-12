package com.example.backend.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import com.example.backend.entity.ClassSD;

public interface ClassSDRepository extends CrudRepository<ClassSD, Integer> {
    @Query("SELECT COUNT(c) > 0 FROM ClassSD c WHERE c.department.depid = :depid")
    boolean existsByDepartmentId(int depid);
}
