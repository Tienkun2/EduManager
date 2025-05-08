package com.example.EduManager.service;

import com.example.EduManager.Enum.ErrorCode;
import com.example.EduManager.dto.request.FeedbackCreationRequest;
import com.example.EduManager.dto.request.FeedbackUpdateRequest;
import com.example.EduManager.dto.response.FeedbackResponse;
import com.example.EduManager.entity.Feedback;
import com.example.EduManager.entity.User;
import com.example.EduManager.exception.AppException;
import com.example.EduManager.mapper.FeedbackMapper;
import com.example.EduManager.repository.FeedbackRepository;
import com.example.EduManager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final FeedbackMapper feedbackMapper;

    public FeedbackResponse createFeedback(FeedbackCreationRequest request) {
        User user = getAuthenticatedUser();

        Feedback feedback = feedbackMapper.toEntity(request);
        feedback.setUser(user);
        feedback = feedbackRepository.save(feedback);

        return feedbackMapper.toResponse(feedback);
    }

    public FeedbackResponse updateFeedback(String id, FeedbackUpdateRequest request) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_EXISTED));

        feedbackMapper.updateFeedBack(request, feedback);
        feedback = feedbackRepository.save(feedback);

        return feedbackMapper.toResponse(feedback);
    }

    public FeedbackResponse getFeedback(String id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found with ID: " + id));
        return feedbackMapper.toResponse(feedback);
    }

    public void deleteFeedback(String id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_EXISTED));
        feedbackRepository.delete(feedback);
    }

    public List<FeedbackResponse> getAllFeedbacks() {
        List<Feedback> feedbacks = feedbackRepository.findAll();
        return feedbacks.stream()
                .map(feedbackMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<FeedbackResponse> getFeedbacksByUser() {
        User user = getAuthenticatedUser();
        List<Feedback> feedbacks = feedbackRepository.findAllByUser(user);
        return feedbacks.stream()
                .map(feedbackMapper::toResponse)
                .collect(Collectors.toList());
    }

    private User getAuthenticatedUser() {
        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName(); // Nếu token lưu ID thì lấy ID
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }
}