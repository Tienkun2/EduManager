package com.example.EduManager.mapper;

import com.example.EduManager.dto.request.UserCreationRequest;
import com.example.EduManager.dto.request.UserUpdateRequest;
import com.example.EduManager.dto.response.UserResponse;
import com.example.EduManager.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "roles",ignore = true)
    User toUser(UserCreationRequest request);


    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "departmentName", expression = "java(user.getDepartment() != null ? user.getDepartment().getName() : null)")
    @Mapping(target = "staffTypeName", expression = "java(user.getStaffType() != null ? user.getStaffType().getName() : null)")
    UserResponse toUserResponse(User user);

    // Thêm phương thức để chuyển đổi danh sách
    List<UserResponse> toUserResponse(List<User> users);
}
