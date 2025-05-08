package com.example.EduManager.dto.response;

import com.example.EduManager.Enum.ScheduleStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WorkScheduleResponse {
    String id; // ID của công việc
    String userid; // ID của người dùng
    String type; // Loại công việc (Giảng dạy, Công tác, Hành chính, ...)
    String title; // Tiêu đề công việc
    String description; // Mô tả chi tiết về công việc
    String location; // Địa điểm công việc
    LocalDateTime startTime; // Thời gian bắt đầu công việc
    LocalDateTime endTime; // Thời gian kết thúc công việc
    ScheduleStatus status;
}
