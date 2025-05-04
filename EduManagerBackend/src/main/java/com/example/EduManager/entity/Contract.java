// 6. Hợp đồng
package com.example.EduManager.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "contracts")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    String type; // Loại hợp đồng (Thử việc, Xác định thời hạn, Không xác định thời hạn)
    LocalDate signDate;
    LocalDate startDate;
    LocalDate endDate; // null nếu không xác định
    BigDecimal baseSalary;
    String contractFile; // Đường dẫn đến file hợp đồng
    boolean isActive; // Trạng thái hiện tại
}