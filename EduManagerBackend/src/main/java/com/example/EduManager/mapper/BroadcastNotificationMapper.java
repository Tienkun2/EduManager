package com.example.EduManager.mapper;

import com.example.EduManager.dto.request.BroadcastNotificationCreationRequest;
import com.example.EduManager.dto.response.BroadcastNotificationResponse;
import com.example.EduManager.dto.response.NotificationLogResponse;
import com.example.EduManager.entity.BroadcastNotification;
import com.example.EduManager.entity.NotificationLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BroadcastNotificationMapper {
    // BroadcastNotification mappings
    @Mapping(target = "notification.id", source = "notificationId")
    @Mapping(target = "targetDepartment.id", source = "targetDepartmentId")
    @Mapping(target = "targetStaffType.id", source = "targetStaffTypeId")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    BroadcastNotification toBroadcastNotification(BroadcastNotificationCreationRequest request);

    @Mapping(target = "notificationId", source = "notification.id")
    @Mapping(target = "targetDepartmentId", source = "targetDepartment.id")
    @Mapping(target = "targetStaffTypeId", source = "targetStaffType.id")
    BroadcastNotificationResponse toBroadcastNotificationResponse(BroadcastNotification broadcast);
}