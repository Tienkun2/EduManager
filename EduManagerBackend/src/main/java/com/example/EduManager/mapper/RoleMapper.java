package com.example.EduManager.mapper;

import com.example.EduManager.dto.request.RoleRequest;
import com.example.EduManager.dto.response.RoleResponse;
import com.example.EduManager.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
//giúp MapStruct tạo một bean Spring cho interface này.
// Điều này có nghĩa là bạn có thể inject PermissionMapper vào các service hoặc component khác của Spring.
public interface RoleMapper {

    // Bỏ qua k map permissions
    @Mapping(target = "permissions",ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
