package com.example.EduManager.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(unique = true, nullable = false)
    String email;

    @Column(nullable = false)
    String password;

    @ManyToMany
    Set<Role> roles;

    // Thông tin cá nhân cơ bản
    String fullName;
    String gender;
    LocalDate dateOfBirth;
    String identityCard; // Số CMND/CCCD
    String phoneNumber;
    String address;

    // Thông tin làm việc
    String status; // Trạng thái làm việc (đang công tác, nghỉ phép, nghỉ hưu)

    // Mối quan hệ với các entity chính
    @ManyToOne
    @JoinColumn(name = "department_id")
    Department department; // Đơn vị trực thuộc

    @ManyToOne
    @JoinColumn(name = "staff_type_id")
    StaffType staffType; // Loại nhân sự

    LocalDate createdDate;
    LocalDate updatedDate;
}