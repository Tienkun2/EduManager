package com.example.EduManager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttendanceCreationRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotNull(message = "Date is required")
    @PastOrPresent(message = "Date cannot be in the future")
    private LocalDate date;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "PRESENT|ABSENT", message = "Status must be either PRESENT or ABSENT")
    private String status;

    private LocalTime checkInTime;

    private LocalTime checkOutTime;
}