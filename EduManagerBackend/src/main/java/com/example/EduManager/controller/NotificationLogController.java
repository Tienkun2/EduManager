package com.example.EduManager.controller;

import com.example.EduManager.dto.request.ApiResponse;
import com.example.EduManager.dto.response.NotificationLogResponse;
import com.example.EduManager.service.NotificationLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notification-logs")
@RequiredArgsConstructor
public class NotificationLogController {
    private final NotificationLogService notificationLogService;

    /**
     * Lấy danh sách lịch sử hành động (SENT, READ, PROCESSED) của một thông báo.
     * @param notificationId ID của thông báo.
     * @return ApiResponse chứa danh sách lịch sử.
     */
    @GetMapping("/notification/{notificationId}")
    public ApiResponse<List<NotificationLogResponse>> getLogsByNotificationId(@PathVariable String notificationId) {
        List<NotificationLogResponse> responses = notificationLogService.getLogsByNotificationId(notificationId);
        return ApiResponse.<List<NotificationLogResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Notification logs retrieved successfully")
                .result(responses)
                .build();
    }

    /**
     * Ghi log khi người dùng đọc một thông báo.
     * @param notificationId ID của thông báo.
     * @param userId ID của người dùng.
     * @return ApiResponse xác nhận hành động thành công.
     */
    @PostMapping("/read/{notificationId}/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> logNotificationRead(
            @PathVariable String notificationId,
            @PathVariable String userId) {
        notificationLogService.logNotificationRead(notificationId, userId);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Notification read logged successfully")
                .build();
    }
}