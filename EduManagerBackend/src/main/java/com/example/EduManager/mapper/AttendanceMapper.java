package com.example.EduManager.mapper;

import com.example.EduManager.Enum.AttendanceStatus;
import com.example.EduManager.dto.AttendanceCreationRequest;
import com.example.EduManager.dto.AttendanceResponse;
import com.example.EduManager.dto.AttendanceUpdateRequest;
import com.example.EduManager.dto.request.UserCreationRequest;
import com.example.EduManager.dto.request.UserUpdateRequest;
import com.example.EduManager.dto.response.UserResponse;
import com.example.EduManager.entity.Attendance;
import com.example.EduManager.entity.User;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface AttendanceMapper {
    @Autowired
    UserMapper userMapper = null; // Inject UserMapper

    @Mapping(source = "userId", target = "user.id")
    Attendance toAttendance(AttendanceCreationRequest request);

    @Mapping(target = "user", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateAttendance(AttendanceUpdateRequest request, @MappingTarget Attendance attendance);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.fullName", target = "userFullName")
    @Mapping(source = "status", target = "status")
    AttendanceResponse toAttendanceResponse(Attendance attendance);

    List<AttendanceResponse> toAttendanceResponse(List<Attendance> attendances);

}
