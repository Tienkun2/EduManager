package com.example.EduManager.service;


import com.example.EduManager.Enum.ErrorCode;
import com.example.EduManager.dto.request.WorkScheduleCreationRequest;
import com.example.EduManager.dto.response.WorkScheduleResponse;
import com.example.EduManager.entity.User;
import com.example.EduManager.entity.WorkSchedule;
import com.example.EduManager.exception.AppException;
import com.example.EduManager.mapper.WorkScheduleMapper;
import com.example.EduManager.repository.UserRepository;
import com.example.EduManager.repository.WorkScheduleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@RequiredArgsConstructor
public class WorkScheduleService {
    private final UserRepository userRepository;
    private final WorkScheduleRepository workScheduleRepository;
    private final WorkScheduleMapper workScheduleMapper;

    public WorkScheduleResponse createWorkSchedule(String id , WorkScheduleCreationRequest request){;;
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        // check trùng lặp lịch làm việc
        validateScheduleOverlap(id, request.getStartTime(), request.getEndTime(), null);
        // check trùng lặp địa điểm
        validateLocationOverlap(request.getLocation(), request.getStartTime(), request.getEndTime(), null);


        WorkSchedule workSchedule = workScheduleMapper.toWorkSchedule(request);

        workSchedule.setUser(user);
        return workScheduleMapper.toWorkScheduleResponse(workScheduleRepository.save(workSchedule));
    }

    public List<WorkScheduleResponse> getAllWorkScheduleByUserId(String id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        List<WorkSchedule> workSchedules = workScheduleRepository.findByUserId(user.getId());
        return workSchedules.stream()
                .map(workScheduleMapper::toWorkScheduleResponse)
                .collect(Collectors.toList());
    }

    public List<WorkScheduleResponse> getAllWorkSchedule(){
        List<WorkSchedule> workSchedules = workScheduleRepository.findAll();
        return workSchedules.stream()
                .map(workScheduleMapper::toWorkScheduleResponse)
                .collect(Collectors.toList());
    }

    // In WorkScheduleService.java
    private void validateScheduleOverlap(String userId, LocalDateTime startTime, LocalDateTime endTime, String scheduleId) {
        List<WorkSchedule> overlappingSchedules = workScheduleRepository.findOverlappingSchedules(
                userId, startTime, endTime, scheduleId);

        if (!overlappingSchedules.isEmpty()) {
            throw new AppException(ErrorCode.SCHEDULE_OVERLAP);
        }
    }

    private void validateLocationOverlap(String location, LocalDateTime startTime, LocalDateTime endTime, String scheduleId) {
        if (location != null && !location.isEmpty()) {
            List<WorkSchedule> overlappingLocations = workScheduleRepository.findByLocationAndTime(
                    location, startTime, endTime, scheduleId);
            if (!overlappingLocations.isEmpty()) {
                throw new AppException(ErrorCode.LOCATION_OVERLAP);
            }
        }
    }

    public WorkScheduleResponse updateWorkSchedule(String userId, String scheduleId, WorkScheduleCreationRequest request) {
        // Tìm lịch hiện tại
        WorkSchedule existingSchedule = workScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new AppException(ErrorCode.SCHEDULE_NOT_FOUND));

        // Kiểm tra quyền: userId phải khớp với userId của lịch
        if (!existingSchedule.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Kiểm tra trùng lặp thời gian của người dùng
        validateScheduleOverlap(
                userId,
                request.getStartTime(),
                request.getEndTime(),
                scheduleId); // Loại trừ lịch hiện tại khỏi kiểm tra

        // Kiểm tra trùng lặp địa điểm
        validateLocationOverlap(
                request.getLocation(),
                request.getStartTime(),
                request.getEndTime(),
                scheduleId); // Loại trừ lịch hiện tại khỏi kiểm tra

        // Cập nhật các thuộc tính của lịch
        existingSchedule.setType(request.getType());
        existingSchedule.setTitle(request.getTitle());
        existingSchedule.setDescription(request.getDescription());
        existingSchedule.setLocation(request.getLocation());
        existingSchedule.setStartTime(request.getStartTime());
        existingSchedule.setEndTime(request.getEndTime());
        existingSchedule.setUpdatedAt(LocalDateTime.now());

        // Lưu lịch đã cập nhật
        return workScheduleMapper.toWorkScheduleResponse(workScheduleRepository.save(existingSchedule));
    }


    public void deleteWorkSchedule(String userId, String scheduleId) {
        WorkSchedule existingSchedule = workScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new AppException(ErrorCode.SCHEDULE_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Check if the user is authorized to delete this schedule
        if (!existingSchedule.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        workScheduleRepository.delete(existingSchedule);
    }

    public List<WorkScheduleResponse> getAllWorkScheduleByType(String type){
        List<WorkSchedule> workSchedules = workScheduleRepository.findByType(type);
        return workSchedules.stream()
                .map(workScheduleMapper::toWorkScheduleResponse)
                .collect(Collectors.toList());
    }

    public List<WorkScheduleResponse> getAllWorkScheduleByTime(LocalDateTime startTime, LocalDateTime endTime){
        List<WorkSchedule> workSchedules = workScheduleRepository.findByStartTimeBetween(startTime, endTime);
        if (workSchedules.isEmpty()) {
            throw new AppException(ErrorCode.SCHEDULE_NOT_FOUND);
        }
        return workSchedules.stream()
                .map(workScheduleMapper::toWorkScheduleResponse)
                .collect(Collectors.toList());
    }

    private User getAuthenticatedUser() {
        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName(); // Nếu token lưu ID thì lấy ID
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    public List<WorkScheduleResponse> getAllWorkScheduleByUser() {
        // Lấy user đã xác thực
        User user = getAuthenticatedUser();

        // Truy vấn danh sách WorkSchedule của user từ repository
        List<WorkSchedule> workSchedules = workScheduleRepository.findByUser(user);

        // Chuyển đổi danh sách WorkSchedule thành danh sách WorkScheduleResponse
        return workSchedules.stream()
                .map(workScheduleMapper::toWorkScheduleResponse)
                .collect(Collectors.toList());
    }
}
