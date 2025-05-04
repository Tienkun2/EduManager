package com.example.EduManager.controller;

import com.example.EduManager.Enum.LeaveStatus;
import com.example.EduManager.dto.request.ApiResponse;
import com.example.EduManager.dto.request.LeaveRequestCreation;
import com.example.EduManager.dto.request.LeaveRequestUpdate;
import com.example.EduManager.dto.response.LeaveRequestResponse;
import com.example.EduManager.service.LeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/leave-requests")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    @PostMapping()
    public LeaveRequestResponse createLeaveRequest(@RequestBody LeaveRequestCreation request) {
        return leaveRequestService.createLeaveRequest(request);
    }

    @GetMapping("/{id}")
    public LeaveRequestResponse getLeaveRequestById(@PathVariable String id) {
        return leaveRequestService.getLeaveRequestById(id);
    }

    @GetMapping
    public Page<LeaveRequestResponse> getAllLeaveRequests(Pageable pageable) {
        return leaveRequestService.getAllLeaveRequests(pageable);
    }

    @GetMapping("/active")
    public List<LeaveRequestResponse> getActiveLeaveRequestsForDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return leaveRequestService.getActiveLeaveRequestsForDateRange(startDate, endDate);
    }

    @GetMapping("/pending-approver/{approverId}")
    public List<LeaveRequestResponse> getPendingLeaveRequestsForApprover(@PathVariable String approverId) {
        return leaveRequestService.getPendingLeaveRequestsForApprover(approverId);
    }

    @DeleteMapping("/{id}")
    public void deleteLeaveRequest(@PathVariable String id,
                                   @RequestParam String userId) {
        leaveRequestService.deleteLeaveRequest(id, userId);
    }

    @PutMapping("/{id}/{userId}")
    public LeaveRequestResponse updateLeaveRequest(@PathVariable String id,
                                                   @PathVariable String userId,
                                                   @RequestBody LeaveRequestUpdate request) {
        return leaveRequestService.updateLeaveRequest(id, request);
    }

    @GetMapping("/myLeaveRequests")
    public ApiResponse<List<LeaveRequestResponse>> getAllLeaveRequestByUser() {
        return ApiResponse.<List<LeaveRequestResponse>>builder()
                .code(200)
                .message("Get all leave request success")
                .result(leaveRequestService.getAllLeaveRequestByUser())
                .build();
    }
}