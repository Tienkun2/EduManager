package com.example.EduManager.entity;

import com.example.EduManager.Enum.LeaveStatus;
import com.example.EduManager.Enum.LeaveType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "leave_requests")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false)
    LeaveType leaveType;

    @Column(name = "reason")
    String reason;

    @Column(name = "start_date", nullable = false)
    LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    LocalDateTime endDate;

    @Column(name = "total_days")
    Double totalDays;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    LeaveStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    User approvedBy;

    @Column(name = "approval_date")
    LocalDateTime approvalDate;

    @Column(name = "approval_comments")
    String approvalComments;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "substitute_user_id")
    User substituteUser;

    @Column(name = "attachment_url")
    String attachmentUrl;

    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        status = LeaveStatus.PENDING;
        calculateTotalDays();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateTotalDays();
    }

    private void calculateTotalDays() {
        if (startDate != null && endDate != null) {
            // Tính số ngày giữa startDate và endDate
            long days = ChronoUnit.DAYS.between(
                    startDate.toLocalDate(),
                    endDate.toLocalDate());

            // Cộng thêm 1 để tính cả ngày cuối
            totalDays = (double) days + 1;

            // Logic phức tạp hơn có thể được thêm vào đây, ví dụ:
            // - Chỉ tính ngày làm việc (bỏ qua cuối tuần)
            // - Tính số giờ nghỉ nếu nghỉ không đủ ngày
        }
    }
}