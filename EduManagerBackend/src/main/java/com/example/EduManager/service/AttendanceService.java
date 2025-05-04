package com.example.EduManager.service;

import com.example.EduManager.Enum.ErrorCode;
import com.example.EduManager.dto.AttendanceCreationRequest;
import com.example.EduManager.dto.AttendanceResponse;
import com.example.EduManager.dto.AttendanceUpdateRequest;
import com.example.EduManager.dto.request.ApiResponse;
import com.example.EduManager.entity.Attendance;
import com.example.EduManager.entity.User;
import com.example.EduManager.exception.AppException;
import com.example.EduManager.mapper.AttendanceMapper;
import com.example.EduManager.repository.AttendanceRepository;
import com.example.EduManager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;
    @Autowired
    private AttendanceMapper attendanceMapper;
    @Autowired
    private UserRepository userRepository;

    public AttendanceResponse createAttendance(AttendanceCreationRequest request) {
        Attendance attendance = attendanceMapper.toAttendance(request);
        return attendanceMapper.toAttendanceResponse(attendanceRepository.save(attendance));
    }

    public List<AttendanceResponse> getAllAttendances() {
        List<Attendance> attendances = attendanceRepository.findAll();
        return attendanceMapper.toAttendanceResponse(attendances);
    }

    public AttendanceResponse getAttendanceById(String id) {
        Optional<Attendance> attendance = attendanceRepository.findById(id);
        return attendance.map(attendanceMapper::toAttendanceResponse).orElse(null);
    }

    public AttendanceResponse updateAttendance(String id, AttendanceUpdateRequest request) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));
        attendanceMapper.updateAttendance(request, attendance);
        return attendanceMapper.toAttendanceResponse(attendanceRepository.save(attendance));
    }

    public void deleteAttendance(String id) {
        attendanceRepository.deleteById(id);
    }


    private User getAuthenticatedUser() {
        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName(); // Nếu token lưu ID thì lấy ID
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    public List<AttendanceResponse> getMyAttendance(Pageable pageable) {
        User user = getAuthenticatedUser();
        // Sử dụng phân trang để tối ưu hiệu năng
        Page<Attendance> attendancePage = attendanceRepository.findByUser(user, pageable);
        return attendancePage.getContent().stream()
                .map(attendanceMapper::toAttendanceResponse)
                .collect(Collectors.toList());
    }
}