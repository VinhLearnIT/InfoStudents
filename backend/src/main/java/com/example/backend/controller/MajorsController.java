package com.example.backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.MajorsDTO;
import com.example.backend.entity.Majors;
import com.example.backend.service.MajorsService;

@RestController
@RequestMapping("/api/majors")
@CrossOrigin(origins = { "http://localhost:3000" })
public class MajorsController {
    @Autowired
    private MajorsService majorsService;

    @GetMapping
    public ResponseEntity<Iterable<Majors>> getAllMajors() {
        Iterable<Majors> majors = majorsService.getAllMajors();
        return ResponseEntity.ok(majors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Majors> getMajorsById(@PathVariable int id) {
        Optional<Majors> majors = majorsService.getMajorById(id);
        return majors.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Majors> createMajors(@RequestBody MajorsDTO majorsDTO) {
        Majors majors = majorsService.createMajors(majorsDTO);
        return ResponseEntity.ok(majors);

    }

    @PutMapping("/{id}")
    public ResponseEntity<Majors> updateMajors(@PathVariable int id, @RequestBody MajorsDTO majorsDTO) {
        try {
            Majors updatedMajors = majorsService.updateMajors(id, majorsDTO);
            return ResponseEntity.ok(updatedMajors);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMajors(@PathVariable int id) {
        try {
            boolean isDeleted = majorsService.deleteMajors(id);
            if (isDeleted) {
                return ResponseEntity.ok("Xóa chuyên ngành thành công");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
