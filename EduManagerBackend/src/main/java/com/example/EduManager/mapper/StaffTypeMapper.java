package com.example.EduManager.mapper;

import com.example.EduManager.dto.request.StaffTypeUpdateRequest;
import com.example.EduManager.dto.request.StaffTypeCreationRequest;
import com.example.EduManager.dto.response.StaffTypeResponse;
import com.example.EduManager.entity.StaffType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StaffTypeMapper {
    // Bỏ qua k map role
    @Mapping(target = "roles",ignore = true)
    StaffType toStaffType(StaffTypeCreationRequest request);

    @Mapping(target = "roles",ignore = true)
    void updateStaffType(@MappingTarget StaffType staffType, StaffTypeUpdateRequest request);

    StaffTypeResponse toStaffTypeResponse(StaffType staffType);
}
