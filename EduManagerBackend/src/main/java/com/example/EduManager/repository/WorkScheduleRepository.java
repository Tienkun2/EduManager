package com.example.EduManager.repository;

import com.example.EduManager.entity.User;
import com.example.EduManager.entity.WorkSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WorkScheduleRepository extends JpaRepository<WorkSchedule, String> {
    // Tìm kiếm theo ID
    Optional<WorkSchedule> findById(String id);

    List<WorkSchedule> findByUser(User user);
    // Tìm kiếm theo ID người dùng
    List<WorkSchedule> findByUserId(String userId);
    // Tìm kiếm theo loại công việc
    List<WorkSchedule> findByType(String type);
    // Tìm kiếm theo thời gian bắt đầu
    List<WorkSchedule> findByStartTimeBetween(LocalDateTime startTime, LocalDateTime endTime);


    // Check trùng lặp lịch làm việc dựa trên thời gian và người dùng
    @Query("SELECT ws FROM WorkSchedule ws WHERE ws.user.id = :userId " +
            "AND ((ws.startTime < :endTime AND ws.endTime > :startTime)) " +
            "AND (ws.id != :id OR :id IS NULL)")
    List<WorkSchedule> findOverlappingSchedules(
            @Param("userId") String userId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("id") String id);

    // Check trùng lặp lịch làm việc dựa trên thời gian và địa điểm
    @Query("SELECT w FROM WorkSchedule w WHERE w.location = :location " +
            "AND w.id != :scheduleId " +
            "AND ((w.startTime <= :endTime AND w.endTime >= :startTime) " +
            "OR (w.startTime >= :startTime AND w.startTime <= :endTime) " +
            "OR (w.endTime >= :startTime AND w.endTime <= :endTime))")
    List<WorkSchedule> findByLocationAndTime(
            @Param("location") String location,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("scheduleId") String scheduleId);
}
