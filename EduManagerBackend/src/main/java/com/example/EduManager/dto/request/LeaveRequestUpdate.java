package com.example.EduManager.dto.request;

import com.example.EduManager.Enum.LeaveStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestUpdate {
    private LeaveStatus status;
    private String approvalComments;
}