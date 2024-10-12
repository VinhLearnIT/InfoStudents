package com.example.backend.service;

import com.example.backend.dto.StudentsDTO;
import com.example.backend.entity.Students;
import com.example.backend.entity.ClassSD;
import com.example.backend.entity.Majors;
import com.example.backend.repository.ClassSDRepository;
import com.example.backend.repository.MajorsRepository;
import com.example.backend.repository.ResultRepository;
import com.example.backend.repository.StudentsRepository;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentsService {

    @Autowired
    private StudentsRepository studentsRepository;

    @Autowired
    private ClassSDRepository classSDRepository;

    @Autowired
    private MajorsRepository majorsRepository;

    @Autowired
    private ResultRepository resultRepository;

    public Iterable<Students> getAllStudents() {
        return studentsRepository.findAllExceptAdmin();
    }

    public Optional<Students> getStudentById(int id) {
        return studentsRepository.findById(id);
    }

    public Optional<Integer> login(String email, String password) {
        Optional<Students> student = studentsRepository.findByEmail(email);
        if (student.isPresent() && student.get().getPassword().equals(password)) {
            return Optional.of(student.get().getStudentid());
        }
        return Optional.empty();
    }

    public boolean changePassword(int studentId, String oldPassword, String newPassword) {
        Optional<Students> studentOptional = studentsRepository.findById(studentId);

        if (studentOptional.isPresent()) {
            Students student = studentOptional.get();
            if (student.getPassword().equals(oldPassword)) {
                student.setPassword(newPassword);
                studentsRepository.save(student);
                return true;
            } else {
                throw new RuntimeException("Mật khẩu hiện tại không chính xác");
            }
        }
        return false;
    }

    public Students createStudent(StudentsDTO studentsDTO) {
        Students student = new Students();
        student.setStudentname(studentsDTO.getStudentname());
        student.setGender(studentsDTO.getGender());
        student.setBirthday(studentsDTO.getBirthday());
        student.setCitizenid(studentsDTO.getCitizenid());
        student.setReligion(studentsDTO.getReligion());
        student.setPhonenumber(studentsDTO.getPhonenumber());
        student.setBirthplace(studentsDTO.getBirthplace());
        student.setLveducation(studentsDTO.getLveducation());
        student.setEmail(studentsDTO.getEmail());
        student.setPassword("12345678");
        student.setNotes(studentsDTO.getNotes());

        if (studentsDTO.getImage() != null && !studentsDTO.getImage().isEmpty()) {
            try {
                String uploadDir = "src/main/resources/static/Images/";
                Path imagePath = Paths.get(uploadDir + studentsDTO.getImage().getOriginalFilename());
                Files.copy(studentsDTO.getImage().getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
                student.setImage(
                        "http://localhost:8080/api/students/images/" + studentsDTO.getImage().getOriginalFilename());
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            student.setImage("http://localhost:8080/api/students/images/avatar.jpg");
        }

        // Set class and major as before
        ClassSD classsd = classSDRepository.findById(studentsDTO.getClassid()).orElse(null);
        student.setClasssd(classsd);

        Majors majors = majorsRepository.findById(studentsDTO.getMajorsid()).orElse(null);
        student.setMajors(majors);

        return studentsRepository.save(student);
    }

    public Students updateStudent(int id, StudentsDTO studentsDTO) {
        Students studentToUpdate = studentsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        studentToUpdate.setStudentname(studentsDTO.getStudentname());
        studentToUpdate.setGender(studentsDTO.getGender());
        studentToUpdate.setBirthday(studentsDTO.getBirthday());
        studentToUpdate.setCitizenid(studentsDTO.getCitizenid());
        studentToUpdate.setReligion(studentsDTO.getReligion());
        studentToUpdate.setPhonenumber(studentsDTO.getPhonenumber());
        studentToUpdate.setBirthplace(studentsDTO.getBirthplace());
        studentToUpdate.setLveducation(studentsDTO.getLveducation());
        studentToUpdate.setEmail(studentsDTO.getEmail());
        studentToUpdate.setNotes(studentsDTO.getNotes());

        // Update image if a new one is provided
        if (studentsDTO.getImage() != null && !studentsDTO.getImage().isEmpty()) {
            try {
                String uploadDir = "src/main/resources/static/Images/";
                Path imagePath = Paths.get(uploadDir + studentsDTO.getImage().getOriginalFilename());
                Files.copy(studentsDTO.getImage().getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
                studentToUpdate.setImage(
                        "http://localhost:8080/api/students/images/" + studentsDTO.getImage().getOriginalFilename());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        ClassSD classsd = classSDRepository.findById(studentsDTO.getClassid()).orElse(null);
        studentToUpdate.setClasssd(classsd);

        Majors majors = majorsRepository.findById(studentsDTO.getMajorsid()).orElse(null);
        studentToUpdate.setMajors(majors);

        return studentsRepository.save(studentToUpdate);
    }

    public boolean deleteStudent(int studentid) {
        if (studentsRepository.existsById(studentid)) {
            resultRepository.deleteByStudentId(studentid);
            studentsRepository.deleteById(studentid);
            return true;
        }
        return false;
    }
}
