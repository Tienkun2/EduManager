package com.example.EduManager.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "invalidated_token")
public class InvalidatedToken {
    @Id
    String id;
    Date expiryTime;
    // Vì sao lại lưu thêm cái expiryTime này?
    // Vì khi mà token đã hết hạn thì không cần phải lưu trong db nữa
    // mà chỉ cần lưu lại thời gian hết hạn của token đó
    // để có thể kiểm tra xem token đó đã hết hạn hay chưa
    // Nếu đã hết hạn thì xóa khỏi db
    // Nếu chưa hết hạn thì không xóa khỏi db
}
