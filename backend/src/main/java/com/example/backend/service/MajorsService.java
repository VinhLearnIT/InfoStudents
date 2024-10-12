package com.example.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.MajorsDTO;
import com.example.backend.entity.Majors;
import com.example.backend.repository.MajorsRepository;
import com.example.backend.repository.StudentsRepository;

@Service
public class MajorsService {
    @Autowired
    private MajorsRepository majorsRepository;

    @Autowired
    private StudentsRepository studentsRepository;

    public Iterable<Majors> getAllMajors() {
        return majorsRepository.findAll();
    }

    public Optional<Majors> getMajorById(int id) {
        return majorsRepository.findById(id);
    }

    public Majors createMajors(MajorsDTO dto) {
        Majors majors = new Majors();
        majors.setMajorsname(dto.getMajorsname());
        return majorsRepository.save(majors);
    }

    public Majors updateMajors(int id, MajorsDTO dto) {
        Majors majors = majorsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy"));
        majors.setMajorsname(dto.getMajorsname());
        return majorsRepository.save(majors);
    }

    public boolean deleteMajors(int id) {
        if (studentsRepository.existsByMajorsId(id)) {
            throw new RuntimeException("Không thể xóa, chuyên ngành này đã có sinh viên.");
        }

        if (majorsRepository.existsById(id)) {
            majorsRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
