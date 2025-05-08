package com.example.EduManager.service;

import com.example.EduManager.Enum.ErrorCode;
import com.example.EduManager.Enum.NotificationAction;
import com.example.EduManager.dto.response.NotificationLogResponse;
import com.example.EduManager.entity.Notification;
import com.example.EduManager.entity.NotificationLog;
import com.example.EduManager.entity.User;
import com.example.EduManager.exception.AppException;
import com.example.EduManager.mapper.NotificationMapper;
import com.example.EduManager.repository.NotificationLogRepository;
import com.example.EduManager.repository.NotificationRepository;
import com.example.EduManager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationLogService {
    private final NotificationLogRepository notificationLogRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final UserRepository userRepository;

    public List<NotificationLogResponse> getLogsByNotificationId(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICAION_NOT_FOUND));

        return notificationLogRepository.findByNotificationOrderByActionAtDesc(notification)
                .stream()
                .map(notificationMapper::toNotificationLogResponse)
                .collect(Collectors.toList());
    }

    public void logNotificationRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICAION_NOT_FOUND));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        NotificationLog log = NotificationLog.builder()
                .notification(notification)
                .action(NotificationAction.READ)
                .actionBy(user)
                .actionAt(LocalDateTime.now())
                .build();
        notificationLogRepository.save(log);
    }
}