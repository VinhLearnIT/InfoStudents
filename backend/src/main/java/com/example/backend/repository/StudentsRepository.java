package com.example.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.example.backend.entity.Students;

public interface StudentsRepository extends CrudRepository<Students, Integer> {
    @Query("SELECT s FROM Students s WHERE s.email = :email AND s.notes = 'admin'")
    Optional<Students> findByEmail(@Param("email") String email);

    @Query("SELECT s FROM Students s WHERE s.notes != 'admin'")
    Iterable<Students> findAllExceptAdmin();

    @Query("SELECT COUNT(s) > 0 FROM Students s WHERE s.classsd.classid = :classId")
    boolean existsByClassId(int classId);

    @Query("SELECT COUNT(s) > 0 FROM Students s WHERE s.majors.majorsid = :majorsId")
    boolean existsByMajorsId(int majorsId);
}
