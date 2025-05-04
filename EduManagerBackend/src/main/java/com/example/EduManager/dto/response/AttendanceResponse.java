package com.example.EduManager.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceResponse {

    private String id;

    private String userId;

    private String userFullName;

    private LocalDate date;

    private String status;

    private LocalTime checkInTime;

    private LocalTime checkOutTime;
}