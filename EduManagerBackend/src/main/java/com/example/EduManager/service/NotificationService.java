package com.example.EduManager.service;

import com.example.EduManager.Enum.NotificationStatus;
import com.example.EduManager.dto.request.NotificationCreationRequest;
import com.example.EduManager.dto.request.NotificationInfoUpdateRequest;
import com.example.EduManager.dto.request.NotificationUpdateRequest;
import com.example.EduManager.dto.response.NotificationResponse;
import com.example.EduManager.entity.Notification;
import com.example.EduManager.entity.Role;
import com.example.EduManager.entity.User;
import com.example.EduManager.exception.AppException;
import com.example.EduManager.Enum.ErrorCode;
import com.example.EduManager.mapper.NotificationMapper;
import com.example.EduManager.repository.NotificationRepository;
import com.example.EduManager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    public NotificationResponse createNotification(NotificationCreationRequest request) {
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        User receiver = request.getReceiverId() != null
                ? userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED))
                : null;

        Notification notification = notificationMapper.toNotification(request);
        notification.setSender(sender);
        notification.setReceiver(receiver);

        notification = notificationRepository.save(notification);
        return notificationMapper.toNotificationResponse(notification);
    }

    public NotificationResponse updateNotification(String id, NotificationUpdateRequest request) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICAION_NOT_FOUND));

        notificationMapper.updateNotificationFromRequest(request, notification);
        notification.setUpdatedAt(LocalDateTime.now());

        notification = notificationRepository.save(notification);
        return notificationMapper.toNotificationResponse(notification);
    }

    public List<NotificationResponse> getNotificationsForUser() {
        User user = getAuthentication();

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        return notificationRepository.findByReceiverOrBroadcast(
                        user, roles, user.getDepartment(), user.getStaffType())
                .stream()
                .map(notificationMapper::toNotificationResponse)
                .collect(Collectors.toList());
    }

    public NotificationResponse getNotificationById(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICAION_NOT_FOUND));
        return notificationMapper.toNotificationResponse(notification);
    }

    public List<NotificationResponse> getAllNotification(){
        return notificationRepository.findAll().stream()
                .map(notificationMapper::toNotificationResponse)
                .toList();
    }

    public void DeleteNotification(String id){
        notificationRepository.deleteById(id);
    }

    public NotificationResponse updateNotificationInfo(String id, NotificationInfoUpdateRequest request) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICAION_NOT_FOUND));

        notificationMapper.updateNotificationInfo(notification, request);
        notification.setUpdatedAt(LocalDateTime.now());

        notification = notificationRepository.save(notification);
        return notificationMapper.toNotificationResponse(notification);
    }

    /**
     * Đánh dấu tất cả thông báo chưa đọc của người dùng hiện tại thành READ.
     */
    public void markAllNotificationsAsRead() {
        User user = getAuthentication();
        List<Notification> unreadNotifications = notificationRepository.findByReceiverAndStatus(user, "UNREAD");
        unreadNotifications.forEach(notification -> {
            notification.setStatus(NotificationStatus.READ);
            notification.setUpdatedAt(LocalDateTime.now());
        });
        notificationRepository.saveAll(unreadNotifications);
    }

    public User getAuthentication(){
        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName();
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }
}