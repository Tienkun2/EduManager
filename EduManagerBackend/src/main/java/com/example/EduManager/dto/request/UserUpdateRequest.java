package com.example.EduManager.dto.request;

import com.example.EduManager.Enum.ErrorCode;
import com.example.EduManager.validation.DobConstraint;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    @Email(message = "INVALID_EMAIL")
    @Size(min = 3, max = 50, message = "INVALID_EMAIL")
    String email;

    @Size(min = 6, max = 50, message = "INVALID_PASSWORD")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{6,}$|^$", message = "INVALID_PASSWORD")
    String password;

    @Size(max = 10, message = "INVALID_GENDER")
    @Pattern(regexp = "Nam|Nữ|Khác|^$", message = "INVALID_GENDER")
    String gender;

    @DobConstraint(min = 18, message = "INVALID_DOB")
    LocalDate dateOfBirth;

    @Size(max = 20, message = "INVALID_IDENTITY_CARD")
    @Pattern(regexp = "^\\d{9,12}$|^$", message = "INVALID_IDENTITY_CARD")
    String identityCard;

    @Size(max = 15, message = "INVALID_PHONE_NUMBER")
    @Pattern(regexp = "^(0|\\+84)[3|5|7|8|9]\\d{8}$|^$", message = "INVALID_PHONE_NUMBER")
    String phoneNumber;

    @Size(max = 255, message = "INVALID_ADDRESS")
    String address;

    @Size(max = 50, message = "INVALID_STATUS")
    @Pattern(regexp = "Đang hoạt động|Đã khóa|Đã nghỉ việc|^$", message = "INVALID_STATUS")
    String status;

    @Size(max = 100, message = "INVALID_FULL_NAME")
    @Pattern(regexp = "^[A-Za-zÀ-ỹ\\s]+$|^$", message = "INVALID_FULL_NAME")
    String fullName;

    String departmentId;

    String staffTypeId;

    List<@Pattern(regexp = "USER|ADMIN|MANAGER", message = "INVALID_ROLE") String> role;
}