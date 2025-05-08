package com.example.EduManager.controller;

import com.example.EduManager.dto.request.BroadcastNotificationCreationRequest;
import com.example.EduManager.dto.request.ApiResponse;
import com.example.EduManager.dto.response.BroadcastNotificationResponse;
import com.example.EduManager.service.BroadcastNotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/broadcast-notifications")
@RequiredArgsConstructor
public class BroadcastNotificationController {
    private final BroadcastNotificationService broadcastNotificationService;

    /**
     * Tạo một thông báo hàng loạt (chỉ admin thực hiện).
     * @param request Thông tin thông báo hàng loạt (notificationId, targetRole, targetDepartmentId, targetStaffTypeId).
     * @return ApiResponse chứa thông tin thông báo hàng loạt vừa tạo.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BroadcastNotificationResponse> createBroadcastNotification(
            @Valid @RequestBody BroadcastNotificationCreationRequest request) {
        BroadcastNotificationResponse response = broadcastNotificationService.createBroadcastNotification(request);
        return ApiResponse.<BroadcastNotificationResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Broadcast notification created successfully")
                .result(response)
                .build();
    }

    /**
     * Lấy thông tin chi tiết của một thông báo hàng loạt theo ID.
     * @param id ID của thông báo hàng loạt.
     * @return ApiResponse chứa thông tin thông báo.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BroadcastNotificationResponse> getBroadcastNotificationById(@PathVariable String id) {
        BroadcastNotificationResponse response = broadcastNotificationService.getBroadcastNotificationById(id);
        return ApiResponse.<BroadcastNotificationResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Broadcast notification retrieved successfully")
                .result(response)
                .build();
    }
}