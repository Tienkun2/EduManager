package com.example.EduManager.dto.response;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackResponse {
    String id;
    String userId;
    String title;
    String content;
    String status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}