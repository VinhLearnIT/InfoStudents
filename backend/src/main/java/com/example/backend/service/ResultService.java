package com.example.backend.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ResultDTO;
import com.example.backend.entity.Result;
import com.example.backend.entity.Students;
import com.example.backend.repository.ResultRepository;
import com.example.backend.repository.StudentsRepository;

@Service
public class ResultService {
    @Autowired
    private ResultRepository resultRepository;
    @Autowired
    private StudentsRepository studentsRepository;

    public Iterable<Result> getAllResult() {
        return resultRepository.findAll();
    }

    public Optional<Result> getResultById(int id) {
        return resultRepository.findById(id);
    }

    public Iterable<Result> getResultsByStudentId(int studentId) {
        return resultRepository.findByStudentId(studentId);
    }

    public Result createResult(ResultDTO dto) {
        Result result = new Result();
        result.setContent(dto.getContent());
        result.setYear(dto.getYear());
        result.setSemester(dto.getSemester());
        Students student = studentsRepository.findById(dto.getStudentid())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy"));
        result.setStudent(student);
        return resultRepository.save(result);
    }

    public Result updateResult(int id, ResultDTO dto) {
        Result result = resultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy"));
        result.setContent(dto.getContent());
        result.setYear(dto.getYear());
        result.setSemester(dto.getSemester());
        return resultRepository.save(result);
    }

    public boolean deleteResult(int id) {
        if (resultRepository.existsById(id)) {
            resultRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
