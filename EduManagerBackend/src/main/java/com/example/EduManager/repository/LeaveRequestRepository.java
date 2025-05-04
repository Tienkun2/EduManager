package com.example.EduManager.repository;

import com.example.EduManager.entity.LeaveRequest;
import com.example.EduManager.entity.User;
import com.example.EduManager.Enum.LeaveStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, String> {

    List<LeaveRequest> findByUser(User user);

    Page<LeaveRequest> findByUser(User user, Pageable pageable);

    Page<LeaveRequest> findByUserId(String userId, Pageable pageable);

    Page<LeaveRequest> findByStatus(LeaveStatus status, Pageable pageable);

    List<LeaveRequest> findByStatus(LeaveStatus status);

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.user = :user AND lr.status = :status")
    Page<LeaveRequest> findByUserAndStatus(
            @Param("user") User user,
            @Param("status") LeaveStatus status,
            Pageable pageable
    );

    List<LeaveRequest> findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            LeaveStatus status, LocalDateTime endDate, LocalDateTime startDate);

    @Query("SELECT lr FROM LeaveRequest lr WHERE " +
            "(lr.startDate BETWEEN :startDate AND :endDate) OR " +
            "(lr.endDate BETWEEN :startDate AND :endDate) OR " +
            "(:startDate BETWEEN lr.startDate AND lr.endDate)")
    List<LeaveRequest> findOverlappingLeaveRequests(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.user = :user AND " +
            "((lr.startDate BETWEEN :startDate AND :endDate) OR " +
            "(lr.endDate BETWEEN :startDate AND :endDate) OR " +
            "(:startDate BETWEEN lr.startDate AND lr.endDate))")
    List<LeaveRequest> findOverlappingLeaveRequestsForUser(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.user = :user AND " +
            "lr.status <> com.example.EduManager.Enum.LeaveStatus.REJECTED AND " +
            "YEAR(lr.startDate) = :year")
    List<LeaveRequest> findApprovedAndPendingLeaveRequestsByUserAndYear(
            @Param("user") User user,
            @Param("year") int year
    );

    @Modifying
    @Transactional
    @Query("UPDATE LeaveRequest lr SET lr.status = :status, lr.approvalComments = :comments, lr.updatedAt = :updatedAt WHERE lr.id = :id")
    void updateStatusAndComments(
            @Param("id") String id,
            @Param("status") LeaveStatus status,
            @Param("comments") String comments,
            @Param("updatedAt") LocalDateTime updatedAt
    );
}