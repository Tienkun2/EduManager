package com.example.EduManager.mapper;

import com.example.EduManager.dto.request.LeaveRequestCreation;
import com.example.EduManager.dto.request.LeaveRequestUpdate;
import com.example.EduManager.dto.request.UserUpdateRequest;
import com.example.EduManager.dto.response.LeaveRequestResponse;
import com.example.EduManager.entity.LeaveRequest;
import com.example.EduManager.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface LeaveRequestMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "approvedBy", ignore = true)
    @Mapping(target = "approvalDate", ignore = true)
    @Mapping(target = "approvalComments", ignore = true)
    @Mapping(target = "substituteUser", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "totalDays", ignore = true)
    LeaveRequest toLeaveRequest(LeaveRequestCreation request);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "status", source = "status")
    @Mapping(target = "approvalComments", source = "approvalComments")
    void updateLeaveRequest(@MappingTarget LeaveRequest leaveRequest, LeaveRequestUpdate request);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.fullName", target = "userName")
    @Mapping(source = "approvedBy.id", target = "approvedById")
    @Mapping(source = "approvedBy.fullName", target = "approvedByName")
    @Mapping(source = "substituteUser.id", target = "substituteUserId")
    @Mapping(source = "substituteUser.fullName", target = "substituteUserName")
    LeaveRequestResponse toResponse(LeaveRequest request);

    @AfterMapping
    default void setUsersAfterMapping(LeaveRequestCreation request, @MappingTarget LeaveRequest entity,
                                      @Context User currentUser, @Context User substituteUser) {
        entity.setUser(currentUser);
        entity.setSubstituteUser(substituteUser);
    }
}