package com.example.EduManager.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffTypeUpdateRequest {
    String name; // Tên loại nhân sự
    String description; // Mô tả loại nhân sự
    Set<String> role; // Thông tin vai trò liên quan đến loại nhân sự
}
