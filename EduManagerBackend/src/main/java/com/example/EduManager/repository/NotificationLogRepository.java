package com.example.EduManager.repository;

import com.example.EduManager.entity.NotificationLog;
import com.example.EduManager.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, String> {
    // Lấy lịch sử theo thông báo
    List<NotificationLog> findByNotificationOrderByActionAtDesc(Notification notification);
}