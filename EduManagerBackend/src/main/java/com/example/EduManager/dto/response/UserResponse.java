package com.example.EduManager.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
        String id;
        String email;
        String password;
        Set<RoleResponse> roles;
        String staffCode; // Mã số viên chức/cán bộ
        String fullName;
        String gender;
        LocalDate dateOfBirth;
        String identityCard; // Số CMND/CCCD
        String phoneNumber;
        String address;
        String status; // Trạng thái làm việc (đang công tác, nghỉ phép, nghỉ hưu)
        String departmentName;
        String staffTypeName;
        LocalDate createdDate;
}
