package com.example.EduManager.dto.request;
import com.example.EduManager.Enum.LeaveType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestCreation {
    @NotNull(message = "Loại nghỉ phép không được để trống")
    private LeaveType leaveType;

    @Size(max = 500, message = "Lý do không được vượt quá 500 ký tự")
    private String reason;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime endDate;

    private String substituteUserId; // ID của người thay thế (nếu có)

    private String attachmentUrl; // URL đến tệp đính kèm (nếu có)
}