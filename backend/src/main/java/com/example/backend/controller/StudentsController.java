package com.example.backend.controller;

import com.example.backend.dto.StudentsDTO;
import com.example.backend.entity.Students;
import com.example.backend.service.StudentsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = { "http://localhost:3000" })
public class StudentsController {

    @Autowired
    private StudentsService studentsService;

    @GetMapping
    public ResponseEntity<Iterable<Students>> getAllStudents() {
        Iterable<Students> students = studentsService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Students> getStudentById(@PathVariable int id) {
        Optional<Students> student = studentsService.getStudentById(id);
        return student.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestParam("email") String email,
            @RequestParam("password") String password) {
        Optional<Integer> userId = studentsService.login(email, password);
        if (userId.isPresent()) {
            return ResponseEntity.ok(userId);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestParam int id,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        try {
            boolean isPasswordChanged = studentsService.changePassword(id, oldPassword, newPassword);
            if (isPasswordChanged) {
                return ResponseEntity.ok("Đổi mật khẩu thành công");
            } else {
                return ResponseEntity.badRequest().body("Đổi mật khẩu thất bại.");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @PostMapping
    public ResponseEntity<Students> createStudent(
            @RequestParam("studentname") String studentname,
            @RequestParam("gender") String gender,
            @RequestParam("birthday") String birthday,
            @RequestParam("citizenid") String citizenid,
            @RequestParam("religion") String religion,
            @RequestParam("phonenumber") String phonenumber,
            @RequestParam("birthplace") String birthplace,
            @RequestParam("lveducation") String lveducation,
            @RequestParam("email") String email,
            @RequestParam("notes") String notes,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("classid") int classid,
            @RequestParam("majorsid") int majorsid) {

        if (studentname == null || studentname.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        StudentsDTO studentsDTO = new StudentsDTO();
        studentsDTO.setStudentname(studentname);
        studentsDTO.setGender(gender);
        studentsDTO.setBirthday(birthday);
        studentsDTO.setCitizenid(citizenid);
        studentsDTO.setReligion(religion);
        studentsDTO.setPhonenumber(phonenumber);
        studentsDTO.setBirthplace(birthplace);
        studentsDTO.setLveducation(lveducation);
        studentsDTO.setEmail(email);
        studentsDTO.setNotes(notes);
        studentsDTO.setImage(image);
        studentsDTO.setClassid(classid);
        studentsDTO.setMajorsid(majorsid);

        Students newStudent = studentsService.createStudent(studentsDTO);
        return ResponseEntity.ok(newStudent);
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path imagePath = Paths.get("src/main/resources/static/Images", filename);
            Resource resource = new UrlResource(imagePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Students> updateStudent(@PathVariable int id,
            @RequestParam("studentname") String studentname,
            @RequestParam("gender") String gender,
            @RequestParam("birthday") String birthday,
            @RequestParam("citizenid") String citizenid,
            @RequestParam("religion") String religion,
            @RequestParam("phonenumber") String phonenumber,
            @RequestParam("birthplace") String birthplace,
            @RequestParam("lveducation") String lveducation,
            @RequestParam("email") String email,
            @RequestParam("notes") String notes,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("classid") int classid,
            @RequestParam("majorsid") int majorsid) {
        StudentsDTO studentsDTO = new StudentsDTO();
        studentsDTO.setStudentname(studentname);
        studentsDTO.setGender(gender);
        studentsDTO.setBirthday(birthday);
        studentsDTO.setCitizenid(citizenid);
        studentsDTO.setReligion(religion);
        studentsDTO.setPhonenumber(phonenumber);
        studentsDTO.setBirthplace(birthplace);
        studentsDTO.setLveducation(lveducation);
        studentsDTO.setEmail(email);
        studentsDTO.setNotes(notes);
        studentsDTO.setImage(image);
        studentsDTO.setClassid(classid);
        studentsDTO.setMajorsid(majorsid);
        Students updatedStudent = studentsService.updateStudent(id, studentsDTO);
        if (updatedStudent != null) {
            return ResponseEntity.ok(updatedStudent);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable("id") int studentid) {
        boolean isDeleted = studentsService.deleteStudent(studentid);
        if (isDeleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
