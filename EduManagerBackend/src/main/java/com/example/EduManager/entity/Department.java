// 2. Đơn vị/Phòng ban
package com.example.EduManager.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Entity
@Table(name = "departments")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(unique = true)
    String name;
    String description;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    Department parent;

    @OneToMany(mappedBy = "parent")
    Set<Department> children;

    @OneToMany(mappedBy = "department")
    Set<User> users;
}
