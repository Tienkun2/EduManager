package com.example.EduManager.entity;

import com.example.EduManager.Enum.ScheduleStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "work_schedules")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WorkSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Liên kết với bảng Users

    @Column(name = "type", nullable = false)
    private String type; // 'Giảng dạy', 'Công tác', 'Hành chính', etc.

    @Column(name = "title", nullable = false)
    private String title; // Tiêu đề công việc/lịch giảng

    @Column(name = "description")
    private String description; // Mô tả công việc

    @Column(name = "location")
    private String location; // Địa điểm

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime; // Thời gian bắt đầu

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime; // Thời gian kết thúc

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING) // Lưu giá trị enum dưới dạng chuỗi trong DB
    private ScheduleStatus status;

}