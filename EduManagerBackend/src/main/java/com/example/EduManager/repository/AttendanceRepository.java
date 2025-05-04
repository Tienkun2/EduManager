package com.example.EduManager.repository;

import com.example.EduManager.entity.Attendance;
import com.example.EduManager.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    Page<Attendance> findByUser(User user, Pageable pageable);
    List<Attendance> findByUserId(String userId);
    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);
}