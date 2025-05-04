package com.example.EduManager.dto.response;

import com.example.EduManager.Enum.LeaveStatus;
import com.example.EduManager.Enum.LeaveType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestResponse {
    private String id;
    private String userId;
    private String userName;
    private LeaveType leaveType;
    private String reason;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Double totalDays;
    private LeaveStatus status;
    private String approvedById;
    private String approvedByName;
    private LocalDateTime approvalDate;
    private String approvalComments;
    private String substituteUserId;
    private String substituteUserName;
    private String attachmentUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}