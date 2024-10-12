package com.example.backend.controller;

import com.example.backend.dto.ResultDTO;
import com.example.backend.entity.Result;
import com.example.backend.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/result")
@CrossOrigin(origins = { "http://localhost:3000" })
public class ResultController {

    @Autowired
    private ResultService resultService;

    @GetMapping
    public ResponseEntity<Iterable<Result>> getAllResults() {
        Iterable<Result> results = resultService.getAllResult();
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Result> getResultById(@PathVariable int id) {
        Optional<Result> result = resultService.getResultById(id);
        return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<Iterable<Result>> getResultsByStudentId(@PathVariable int id) {
        Iterable<Result> result = resultService.getResultsByStudentId(id);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<Result> createResult(@RequestBody ResultDTO resultDTO) {
        Result createdResult = resultService.createResult(resultDTO);
        return ResponseEntity.ok(createdResult);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Result> updateResult(@PathVariable int id, @RequestBody ResultDTO resultDTO) {
        try {
            Result updatedResult = resultService.updateResult(id, resultDTO);
            return ResponseEntity.ok(updatedResult);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResult(@PathVariable int id) {
        boolean isDeleted = resultService.deleteResult(id);
        if (isDeleted) {
            return ResponseEntity.ok("Xóa thành công");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
