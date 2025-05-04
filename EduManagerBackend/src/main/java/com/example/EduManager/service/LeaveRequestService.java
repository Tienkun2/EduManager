package com.example.EduManager.service;

import com.example.EduManager.Enum.ErrorCode;
import com.example.EduManager.Enum.LeaveStatus;
import com.example.EduManager.dto.request.LeaveRequestCreation;
import com.example.EduManager.dto.request.LeaveRequestUpdate;
import com.example.EduManager.dto.response.LeaveRequestResponse;
import com.example.EduManager.entity.LeaveRequest;
import com.example.EduManager.entity.User;
import com.example.EduManager.exception.AppException;
import com.example.EduManager.mapper.LeaveRequestMapper;
import com.example.EduManager.repository.LeaveRequestRepository;
import com.example.EduManager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final LeaveRequestMapper leaveRequestMapper;
    private Logger logger;

    @Transactional
    public LeaveRequestResponse createLeaveRequest(LeaveRequestCreation request) {
        User currentUser = getAuthenticatedUser();

        User substituteUser = null;
        if (request.getSubstituteUserId() != null) {
            substituteUser = userRepository.findById(request.getSubstituteUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        }

        LeaveRequest leaveRequest = leaveRequestMapper.toLeaveRequest(request);
        leaveRequestMapper.setUsersAfterMapping(request, leaveRequest, currentUser, substituteUser);

        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);
        return leaveRequestMapper.toResponse(savedRequest);
    }

    @Transactional(readOnly = true)
    public LeaveRequestResponse getLeaveRequestById(String id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LEAVE_REQUEST_NOT_FOUND));
        return leaveRequestMapper.toResponse(leaveRequest);
    }

    @Transactional(readOnly = true)
    public Page<LeaveRequestResponse> getAllLeaveRequests(Pageable pageable) {
        return leaveRequestRepository.findAll(pageable)
                .map(leaveRequestMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<LeaveRequestResponse> getLeaveRequestsByUserId(String userId, Pageable pageable) {
        if (!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        return leaveRequestRepository.findByUserId(userId, pageable)
                .map(leaveRequestMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<LeaveRequestResponse> getLeaveRequestsByStatus(LeaveStatus status, Pageable pageable) {
        return leaveRequestRepository.findByStatus(status, pageable)
                .map(leaveRequestMapper::toResponse);
    }


    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getActiveLeaveRequestsForDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        List<LeaveRequest> activeRequests = leaveRequestRepository.findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                LeaveStatus.APPROVED, endDateTime, startDateTime);

        return activeRequests.stream()
                .map(leaveRequestMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getPendingLeaveRequestsForApprover(String approverId) {
        if (!userRepository.existsById(approverId)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        List<LeaveRequest> pendingRequests = leaveRequestRepository.findByStatus(LeaveStatus.PENDING);

        return pendingRequests.stream()
                .map(leaveRequestMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveRequestResponse updateLeaveRequest(String id, LeaveRequestUpdate request) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LEAVE_REQUEST_NOT_FOUND));

        leaveRequestMapper.updateLeaveRequest(leaveRequest, request);
        LeaveRequest updatedLeaveRequest = leaveRequestRepository.save(leaveRequest);
        return leaveRequestMapper.toResponse(updatedLeaveRequest);
    }

    @Transactional
    public void deleteLeaveRequest(String id, String userId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.LEAVE_REQUEST_NOT_FOUND));

        if (!leaveRequest.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.PERMISSION_NOT_EXISTED);
        }

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_OPERATION);
        }

        leaveRequestRepository.delete(leaveRequest);
    }



    private User getAuthenticatedUser() {
        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName();
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    public List<LeaveRequestResponse> getAllLeaveRequestByUser() {
        User user = getAuthenticatedUser();
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findByUser(user);

        return leaveRequests.stream()
                .map(leaveRequestMapper::toResponse)
                .collect(Collectors.toList());
    }
}