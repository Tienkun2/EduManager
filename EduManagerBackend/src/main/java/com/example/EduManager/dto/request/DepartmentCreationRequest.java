// Request DTO for creating a Department
package com.example.EduManager.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentCreationRequest {
    private String name;  // Tên phòng ban

    private String description;  // Mô tả phòng ban

    private String parentName;  // Tên của phòng ban cha (nếu có)
}