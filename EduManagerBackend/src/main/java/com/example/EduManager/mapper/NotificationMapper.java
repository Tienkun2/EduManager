package com.example.EduManager.mapper;

import com.example.EduManager.dto.request.NotificationCreationRequest;
import com.example.EduManager.dto.request.NotificationInfoUpdateRequest;
import com.example.EduManager.dto.request.NotificationUpdateRequest;
import com.example.EduManager.dto.request.BroadcastNotificationCreationRequest;
import com.example.EduManager.dto.response.NotificationResponse;
import com.example.EduManager.dto.response.NotificationLogResponse;
import com.example.EduManager.dto.response.BroadcastNotificationResponse;
import com.example.EduManager.entity.Notification;
import com.example.EduManager.entity.NotificationLog;
import com.example.EduManager.entity.BroadcastNotification;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NotificationMapper {

    // Notification mappings
    @Mapping(target = "sender.id", source = "senderId")
    @Mapping(target = "receiver.id", source = "receiverId")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "status", expression = "java(com.example.EduManager.Enum.NotificationStatus.UNREAD)")
    Notification toNotification(NotificationCreationRequest request);

    @Mapping(target = "senderId", source = "sender.id")
    @Mapping(target = "receiverId", source = "receiver.id")
    NotificationResponse toNotificationResponse(Notification notification);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateNotificationFromRequest(NotificationUpdateRequest request, @MappingTarget Notification notification);

    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "status", expression = "java(com.example.EduManager.Enum.NotificationStatus.UNREAD)")
    void updateNotificationInfo(@MappingTarget Notification notification, NotificationInfoUpdateRequest request);

    // NotificationLog mappings
    @Mapping(target = "notificationId", source = "notification.id")
    @Mapping(target = "actionById", source = "actionBy.id")
    NotificationLogResponse toNotificationLogResponse(NotificationLog log);

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