package com.example.backend.dto;

import lombok.Data;

@Data
public class ResultDTO {
    private String content;
    private String year;
    private String semester;

    private int studentid;
}
