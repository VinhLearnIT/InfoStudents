package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Students {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int studentid;
    private String studentname;
    private String gender;
    private String birthday;
    private String citizenid;
    private String religion;
    private String phonenumber;
    private String birthplace;
    private String lveducation;
    private String email;

    @JsonIgnore
    private String password;
    private String notes;
    private String image;

    @ManyToOne
    @JoinColumn(name = "classid")
    private ClassSD classsd;

    @ManyToOne
    @JoinColumn(name = "majorsid")
    private Majors majors;
}
