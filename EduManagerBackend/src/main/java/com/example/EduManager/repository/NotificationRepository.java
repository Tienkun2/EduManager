package com.example.EduManager.repository;

import com.example.EduManager.entity.Department;
import com.example.EduManager.entity.Notification;
import com.example.EduManager.entity.StaffType;
import com.example.EduManager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    // Lấy thông báo theo người nhận
    List<Notification> findByReceiverOrderByCreatedAtDesc(User receiver);
    // Lấy thông báo theo người gửi
    List<Notification> findByReceiverAndStatus(User receiver, String status);

    // Lấy thông báo hàng loạt hoặc cá nhân cho một user
    @Query("SELECT n FROM Notification n WHERE n.receiver = :user OR n.id IN (" +
            "SELECT bn.notification.id FROM BroadcastNotification bn WHERE " +
            "bn.targetRole IN (:roles) OR bn.targetDepartment = :department OR bn.targetStaffType = :staffType)")
    List<Notification> findByReceiverOrBroadcast(User user, List<String> roles, Department department, StaffType staffType);
}