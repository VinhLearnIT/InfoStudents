package com.example.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ClassSDDTO;
import com.example.backend.entity.ClassSD;
import com.example.backend.entity.Department;
import com.example.backend.repository.ClassSDRepository;
import com.example.backend.repository.DepartmentRepository;
import com.example.backend.repository.StudentsRepository;

@Service
public class ClassSTService {

    @Autowired
    private ClassSDRepository classSDRepository;

    @Autowired
    private StudentsRepository studentsRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public Iterable<ClassSD> getAllClassSD() {
        return classSDRepository.findAll();
    }

    public Optional<ClassSD> getClassSDById(int id) {
        return classSDRepository.findById(id);
    }

    public ClassSD createClassSD(ClassSDDTO dto) {
        ClassSD classSD = new ClassSD();
        classSD.setClassname(dto.getClassname());
        classSD.setCourse(dto.getCourse());

        Department department = departmentRepository.findById(dto.getDepid())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy department"));
        classSD.setDepartment(department);

        return classSDRepository.save(classSD);
    }

    public ClassSD updateClassSD(int id, ClassSDDTO dto) {
        ClassSD classSD = classSDRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy"));

        classSD.setClassname(dto.getClassname());
        classSD.setCourse(dto.getCourse());

        Department department = departmentRepository.findById(dto.getDepid())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy department"));
        classSD.setDepartment(department);

        return classSDRepository.save(classSD);
    }

    public boolean deleteClassSD(int id) {
        if (studentsRepository.existsByClassId(id)) {
            throw new RuntimeException("Không thể xóa, lớp này đã có sinh viên.");
        }

        if (classSDRepository.existsById(id)) {
            classSDRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

}
