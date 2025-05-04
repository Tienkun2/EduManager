// 3. Loại nhân sự (Giảng viên/Cán bộ/Nhân viên)
package com.example.EduManager.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Entity
@Table(name = "staff_types")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaffType {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String name; // Cán bộ quản lý/Giảng viên/Nhân viên hành chính
    String description; // Mô tả loại nhân sự

    @ManyToMany
    Set<Role> roles; // Thông tin vai trò liên quan đến loại nhân sự

    @OneToMany(mappedBy = "staffType")
    Set<User> users;
}
