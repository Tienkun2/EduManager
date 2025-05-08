package com.example.EduManager.mapper;

import com.example.EduManager.dto.request.FeedbackCreationRequest;
import com.example.EduManager.dto.request.FeedbackUpdateRequest;
import com.example.EduManager.dto.response.FeedbackResponse;
import com.example.EduManager.entity.Feedback;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface FeedbackMapper {
    Feedback toEntity(FeedbackCreationRequest request);

    @Mapping(source = "user.id", target = "userId")
    FeedbackResponse toResponse(Feedback feedback);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateFeedBack(FeedbackUpdateRequest request, @MappingTarget Feedback feedback);
}