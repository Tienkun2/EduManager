package com.example.EduManager.controller;


import com.example.EduManager.dto.request.ApiResponse;
import com.example.EduManager.dto.request.WorkScheduleCreationRequest;
import com.example.EduManager.dto.response.WorkScheduleResponse;
import com.example.EduManager.service.WorkScheduleService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/work-schedule")
@NoArgsConstructor
@AllArgsConstructor
public class WorkScheduleController {
    @Autowired
    private WorkScheduleService workScheduleService;
    @PostMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<WorkScheduleResponse> createWorkSchedule(@PathVariable String id, @RequestBody WorkScheduleCreationRequest request){
        return ApiResponse.<WorkScheduleResponse>builder()
                .code(200)
                .message("Create work schedule success")
                .result(workScheduleService.createWorkSchedule(id,request))
                .build();
    }

    @PutMapping("/{userid}/{scheduleid}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<WorkScheduleResponse> updateWorkSchedule(@PathVariable String userid ,@PathVariable String scheduleid, @RequestBody WorkScheduleCreationRequest request) {
        return ApiResponse.<WorkScheduleResponse>builder()
                .code(200)
                .message("Update work schedule success")
                .result(workScheduleService.updateWorkSchedule(userid, scheduleid, request))
                .build();
    }

    @GetMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<WorkScheduleResponse>> getAllWorkSchedule(){
        return ApiResponse.<List<WorkScheduleResponse>>builder()
                .code(200)
                .message("Get all work schedule success")
                .result(workScheduleService.getAllWorkSchedule())
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<WorkScheduleResponse>> getAllWorkScheduleByUserId(@PathVariable String id){
        return ApiResponse.<List<WorkScheduleResponse>>builder()
                .code(200)
                .message("Get all work schedule success")
                .result(workScheduleService.getAllWorkScheduleByUserId(id))
                .build();
    }

    @DeleteMapping("/{userid}/{scheduleid}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> deleteWorkSchedule(@PathVariable String userid, @PathVariable String scheduleid) {
        workScheduleService.deleteWorkSchedule(userid, scheduleid);
        return ApiResponse.<String>builder()
                .code(200)
                .message("Delete work schedule success")
                .result("Deleted work schedule with ID: " + scheduleid)
                .build();
    }

    @GetMapping("/{startTime}/{endTime}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<WorkScheduleResponse>> getAllWorkScheduleByTime(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        return ApiResponse.<List<WorkScheduleResponse>>builder()
                .code(200)
                .message("Get all work schedule success")
                .result(workScheduleService.getAllWorkScheduleByTime(startTime, endTime))
                .build();
    }

    @GetMapping("/myWorkSchedule")
    public ApiResponse<List<WorkScheduleResponse>> getAllWorkScheduleByUser(){
        return ApiResponse.<List<WorkScheduleResponse>>builder()
                .code(200)
                .message("Get all work schedule success")
                .result(workScheduleService.getAllWorkScheduleByUser())
                .build();
    }
}
