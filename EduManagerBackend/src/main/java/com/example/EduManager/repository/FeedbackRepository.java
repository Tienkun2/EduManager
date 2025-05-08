package com.example.EduManager.repository;

import com.example.EduManager.entity.Feedback;
import com.example.EduManager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, String> {
    List<Feedback> findAllByUser(User user);
}