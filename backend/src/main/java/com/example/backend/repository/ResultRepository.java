package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import com.example.backend.entity.Result;

import org.springframework.transaction.annotation.Transactional;

public interface ResultRepository extends CrudRepository<Result, Integer> {
    @Query("SELECT r FROM Result r WHERE r.student.id = :studentId")
    List<Result> findByStudentId(int studentId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Result r WHERE r.student.studentid = :studentId")
    void deleteByStudentId(int studentId);
}
