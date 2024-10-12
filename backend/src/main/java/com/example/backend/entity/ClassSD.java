package com.example.backend.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassSD {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int classid;
    private String classname;
    private String course;

    @ManyToOne
    @JoinColumn(name = "depid")
    private Department department;
}
