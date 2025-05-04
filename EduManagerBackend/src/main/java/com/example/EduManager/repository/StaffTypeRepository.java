package com.example.EduManager.repository;

import com.example.EduManager.entity.StaffType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffTypeRepository extends JpaRepository<StaffType, String> {
    boolean existsByName(String name);
    // Custom query methods can be defined here if needed
}
