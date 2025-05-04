package com.example.EduManager.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffTypeResponse {
    String id; // ID của loại nhân sự
    String name; // Tên loại nhân sự
    String description; // Mô tả loại nhân sự
    Set<RoleResponse> roles; // Thông tin vai trò liên quan đến loại nhân sự
}
