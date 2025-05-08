package com.example.EduManager.repository;

import com.example.EduManager.entity.BroadcastNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BroadcastNotificationRepository extends JpaRepository<BroadcastNotification, String> {
}