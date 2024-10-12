package com.example.backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.ClassSDDTO;
import com.example.backend.entity.ClassSD;
import com.example.backend.service.ClassSTService;

@RestController
@RequestMapping("/api/classsd")
@CrossOrigin(origins = { "http://localhost:3000" })
public class ClassSDController {

    @Autowired
    private ClassSTService classSTService;

    @GetMapping
    public ResponseEntity<Iterable<ClassSD>> getAllClassSD() {
        Iterable<ClassSD> classSDs = classSTService.getAllClassSD();
        return ResponseEntity.ok(classSDs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassSD> getClassSDById(@PathVariable int id) {
        Optional<ClassSD> classSD = classSTService.getClassSDById(id);
        return classSD.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ClassSD> createClassSD(@RequestBody ClassSDDTO classSDDTO) {
        ClassSD newClassSD = classSTService.createClassSD(classSDDTO);
        return ResponseEntity.ok(newClassSD);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassSD> updateClassSD(@PathVariable int id, @RequestBody ClassSDDTO classSDDTO) {
        try {
            ClassSD updatedClassSD = classSTService.updateClassSD(id, classSDDTO);
            return ResponseEntity.ok(updatedClassSD);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClassSD(@PathVariable int id) {
        try {
            boolean isDeleted = classSTService.deleteClassSD(id);
            if (isDeleted) {
                return ResponseEntity.ok("Xóa thành công");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
