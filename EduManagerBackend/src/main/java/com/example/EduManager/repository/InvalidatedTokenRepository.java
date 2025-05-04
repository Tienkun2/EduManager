package com.example.EduManager.repository;

import com.example.EduManager.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {
    // Tìm kiếm token đã bị thu hồi trong db
    Optional<InvalidatedToken> findById(String id);

    // Xóa token đã bị thu hồi trong db
    void deleteById(String id);
}
