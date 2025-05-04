package com.example.EduManager.mapper;


import com.example.EduManager.dto.request.WorkScheduleCreationRequest;
import com.example.EduManager.dto.response.WorkScheduleResponse;
import com.example.EduManager.entity.WorkSchedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface WorkScheduleMapper {
    WorkSchedule toWorkSchedule(WorkScheduleCreationRequest request);

    void updateWorkSchedule(@MappingTarget WorkSchedule workSchedule, WorkScheduleCreationRequest request);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "userid", source = "user.id")
    WorkScheduleResponse toWorkScheduleResponse(WorkSchedule workSchedule);
}
