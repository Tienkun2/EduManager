package com.example.EduManager.controller;

import com.example.EduManager.dto.request.ApiResponse;
import com.example.EduManager.dto.request.FeedbackCreationRequest;
import com.example.EduManager.dto.request.FeedbackUpdateRequest;
import com.example.EduManager.dto.response.FeedbackResponse;
import com.example.EduManager.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping()
    public ApiResponse<FeedbackResponse> createFeedback(@RequestBody FeedbackCreationRequest request) {
        return ApiResponse.<FeedbackResponse>builder()
                .message("Feedback created successfully")
                .result(feedbackService.createFeedback(request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<FeedbackResponse> getFeedback(@PathVariable String id) {
        return ApiResponse.<FeedbackResponse>builder()
                .message("Feedback retrieved successfully")
                .result(feedbackService.getFeedback(id))
                .build();
    }
    @PutMapping("/{id}")
    public ApiResponse<FeedbackResponse> updateFeedback(@PathVariable String id, @RequestBody FeedbackUpdateRequest request) {
        return ApiResponse.<FeedbackResponse>builder()
                .message("Feedback updated successfully")
                .result(feedbackService.updateFeedback(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFeedback(@PathVariable String id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Feedback deleted successfully")
                .result(null)
                .build());
    }

    @GetMapping
    public ApiResponse<List<FeedbackResponse>> getAllFeedbacks() {
        return ApiResponse.<List<FeedbackResponse>>builder()
                .message("All feedbacks retrieved successfully")
                .result(feedbackService.getAllFeedbacks())
                .build();
    }

    @GetMapping("/user")
    public ApiResponse<List<FeedbackResponse>> getFeedbacksByUser() {
        return ApiResponse.<List<FeedbackResponse>>builder()
                .message("Feedbacks retrieved successfully")
                .result(feedbackService.getFeedbacksByUser())
                .build();
    }
}