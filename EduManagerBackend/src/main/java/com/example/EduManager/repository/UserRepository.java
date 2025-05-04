package com.example.EduManager.repository;

import com.example.EduManager.entity.Role;
import com.example.EduManager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,String> {
    Optional<User> findByEmail(String email);
    List<User> findAllByRolesName(String roleName);
}
