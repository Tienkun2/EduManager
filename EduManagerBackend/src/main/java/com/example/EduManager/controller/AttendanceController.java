package com.example.EduManager.controller;

import com.example.EduManager.dto.AttendanceCreationRequest;
import com.example.EduManager.dto.AttendanceResponse;
import com.example.EduManager.dto.AttendanceUpdateRequest;
import com.example.EduManager.dto.request.ApiResponse;
import com.example.EduManager.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendances")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping()
    public ApiResponse<AttendanceResponse> createAttendance(@RequestBody AttendanceCreationRequest request) {
        return ApiResponse.<AttendanceResponse>builder()
                .code(200)
                .result(attendanceService.createAttendance(request))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping()
    public ApiResponse<List<AttendanceResponse>> getAllAttendances() {
        return ApiResponse.<List<AttendanceResponse>>builder()
                .code(200)
                .result(attendanceService.getAllAttendances())
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ApiResponse<AttendanceResponse> getAttendanceById(@PathVariable String id) {
        return ApiResponse.<AttendanceResponse>builder()
                .code(200)
                .result(attendanceService.getAttendanceById(id))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<AttendanceResponse> updateAttendance(@PathVariable String id, @RequestBody AttendanceUpdateRequest request) {
        return ApiResponse.<AttendanceResponse>builder()
                .code(200)
                .result(attendanceService.updateAttendance(id, request))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAttendance(@PathVariable String id) {
        attendanceService.deleteAttendance(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .result(null)
                .build();
    }

    @GetMapping("/getMyAttendance")
    public ApiResponse<List<AttendanceResponse>> getMyAttendance(
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        return ApiResponse.<List<AttendanceResponse>>builder()
                .code(200)
                .result(attendanceService.getMyAttendance(pageable))
                .build();
    }
}