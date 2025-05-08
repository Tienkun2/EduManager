package com.example.EduManager.controller;

import com.example.EduManager.dto.request.ApiResponse;
import com.example.EduManager.dto.request.NotificationCreationRequest;
import com.example.EduManager.dto.request.NotificationInfoUpdateRequest;
import com.example.EduManager.dto.request.NotificationUpdateRequest;
import com.example.EduManager.dto.response.NotificationResponse;
import com.example.EduManager.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    /**
     * Tạo một thông báo mới (admin hoặc user gửi đến user cụ thể hoặc không có người nhận).
     * @param request Thông tin thông báo (senderId, receiverId, title, content, type).
     * @return ApiResponse chứa thông tin thông báo vừa tạo.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<NotificationResponse> createNotification(@Valid @RequestBody NotificationCreationRequest request) {
        NotificationResponse response = notificationService.createNotification(request);
        return ApiResponse.<NotificationResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Notification created successfully")
                .result(response)
                .build();
    }

    /**
     * Cập nhật trạng thái thông báo (ví dụ: từ UNREAD sang READ).
     * @param id ID của thông báo.
     * @param request Thông tin cập nhật (status).
     * @return ApiResponse chứa thông tin thông báo đã cập nhật.
     */
    @PutMapping("/{id}")
    public ApiResponse<NotificationResponse> updateNotification(
            @PathVariable String id,
            @Valid @RequestBody NotificationUpdateRequest request) {
        NotificationResponse response = notificationService.updateNotification(id, request);
        return ApiResponse.<NotificationResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Notification updated successfully")
                .result(response)
                .build();
    }

    /**
     * Lấy danh sách thông báo dành cho một người dùng (cá nhân hoặc hàng loạt).
     *
     * @return ApiResponse chứa danh sách thông báo.
     */
    @GetMapping("/user")
    public ApiResponse<List<NotificationResponse>> getNotificationsForUser() {
        List<NotificationResponse> responses = notificationService.getNotificationsForUser();
        return ApiResponse.<List<NotificationResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Notifications retrieved successfully")
                .result(responses)
                .build();
    }

    /**
     * Lấy thông tin chi tiết của một thông báo theo ID.
     * @param id ID của thông báo.
     * @return ApiResponse chứa thông tin thông báo.
     */
    @GetMapping("/{id}")
    public ApiResponse<NotificationResponse> getNotificationById(@PathVariable String id) {
        NotificationResponse response = notificationService.getNotificationById(id);
        return ApiResponse.<NotificationResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Notification retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<NotificationResponse>> getAllNotificationResponse(){
        return ApiResponse.<List<NotificationResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get all notification successfully")
                .result(notificationService.getAllNotification())
                .build();
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteNotification(@PathVariable String id){
        notificationService.DeleteNotification(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Delete Notification successfully")
                .build();
    }

    @PutMapping("/info/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<NotificationResponse> updateNotificationInfo(
            @PathVariable String id,
            @Valid @RequestBody NotificationInfoUpdateRequest request) {
        NotificationResponse response = notificationService.updateNotificationInfo(id, request);
        return ApiResponse.<NotificationResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Notification info updated successfully")
                .result(response)
                .build();
    }

    /**
     * Đánh dấu tất cả thông báo của người dùng hiện tại là đã đọc.
     * @return ApiResponse thông báo thành công.
     */
    @PutMapping("/mark-all-read")
    public ApiResponse<Void> markAllNotificationsAsRead() {
        notificationService.markAllNotificationsAsRead();
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("All notifications marked as read successfully")
                .build();
    }
}