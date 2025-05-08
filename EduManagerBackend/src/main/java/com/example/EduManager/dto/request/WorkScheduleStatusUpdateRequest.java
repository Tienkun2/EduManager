package com.example.EduManager.dto.request;

import com.example.EduManager.Enum.ScheduleStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WorkScheduleStatusUpdateRequest {
    ScheduleStatus status; // New status for the work schedule
}