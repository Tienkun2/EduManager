package com.example.EduManager.repository;

import com.example.EduManager.entity.LeaveRequest;
import com.example.EduManager.entity.LeaveRequestHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestHistoryRepository extends JpaRepository<LeaveRequestHistory, String> {

    List<LeaveRequestHistory> findByLeaveRequestOrderByCreatedAtDesc(LeaveRequest leaveRequest);
}