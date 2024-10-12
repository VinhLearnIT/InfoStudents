package com.example.backend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class StudentsDTO {
    private String studentname;
    private String gender;
    private String birthday;
    private String citizenid;
    private String religion;
    private String phonenumber;
    private String birthplace;
    private String lveducation;
    private String email;
    private String password;
    private String notes;
    private MultipartFile image;

    private int classid;
    private int majorsid;
}
