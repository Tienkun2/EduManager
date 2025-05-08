package com.example.EduManager.service;

import com.example.EduManager.Enum.ErrorCode;
import com.example.EduManager.dto.request.BroadcastNotificationCreationRequest;
import com.example.EduManager.dto.response.BroadcastNotificationResponse;
import com.example.EduManager.entity.BroadcastNotification;
import com.example.EduManager.entity.Department;
import com.example.EduManager.entity.Notification;
import com.example.EduManager.entity.StaffType;
import com.example.EduManager.exception.AppException;
import com.example.EduManager.mapper.NotificationMapper;
import com.example.EduManager.repository.BroadcastNotificationRepository;
import com.example.EduManager.repository.DepartmentRepository;
import com.example.EduManager.repository.StaffTypeRepository;
import com.example.EduManager.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BroadcastNotificationService {
    private final BroadcastNotificationRepository broadcastNotificationRepository;
    private final NotificationRepository notificationRepository;
    private final DepartmentRepository departmentRepository;
    private final StaffTypeRepository staffTypeRepository;
    private final NotificationMapper notificationMapper;

    public BroadcastNotificationResponse createBroadcastNotification(BroadcastNotificationCreationRequest request) {
        Notification notification = notificationRepository.findById(request.getNotificationId())
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICAION_NOT_FOUND));

        Department department = request.getTargetDepartmentId() != null
                ? departmentRepository.findById(request.getTargetDepartmentId())
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND))
                : null;
        StaffType staffType = request.getTargetStaffTypeId() != null
                ? staffTypeRepository.findById(request.getTargetStaffTypeId())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_TYPE_NOT_FOUND))
                : null;

        BroadcastNotification broadcast = notificationMapper.toBroadcastNotification(request);
        broadcast.setNotification(notification);
        broadcast.setTargetDepartment(department);
        broadcast.setTargetStaffType(staffType);

        broadcast = broadcastNotificationRepository.save(broadcast);
        return notificationMapper.toBroadcastNotificationResponse(broadcast);
    }

    public BroadcastNotificationResponse getBroadcastNotificationById(String id) {
        BroadcastNotification broadcast = broadcastNotificationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BROADCAST_NOTIFICAION_NOT_FOUND));
        return notificationMapper.toBroadcastNotificationResponse(broadcast);
    }
}