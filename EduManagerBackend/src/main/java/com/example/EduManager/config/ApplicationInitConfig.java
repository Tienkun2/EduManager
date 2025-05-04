//package com.example.EduManager.config;
//
//import com.example.EduManager.entity.Role;
//import com.example.EduManager.entity.User;
//import com.example.EduManager.repository.RoleRepository;
//import com.example.EduManager.repository.UserRepository;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.ApplicationRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//import java.util.Collections;
//import java.util.HashSet;
//import java.util.Optional;
//
//@Configuration
//@Slf4j
//public class ApplicationInitConfig {
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Autowired
//    private RoleRepository roleRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Bean
//    ApplicationRunner applicationRunner() {
//        return args -> {
//            // Kiểm tra xem user admin đã tồn tại chưa
//            if (userRepository.findByEmail("admin").isEmpty()) {  // Kiểm tra xem admin đã có chưa
//                // Tìm role "ADMIN" từ RoleRepository
//                Optional<Role> adminRoleOpt = roleRepository.findByName("ADMIN");
//
//                if (adminRoleOpt.isPresent()) {
//                    // Lấy role ADMIN
//                    Role adminRole = adminRoleOpt.get();
//
//                    // Tạo User admin với role ADMIN
//                    User adminUser = User.builder()
//                            .email("admin")
//                            .password(passwordEncoder.encode("admin"))  // Mật khẩu mặc định cho admin
//                            .roles(Collections.singleton(adminRole))  // Gán role ADMIN vào user
//                            .build();
//
//                    userRepository.save(adminUser);
//                    log.warn("Admin user has been created with default password: admin, please change it.");
//                } else {
//                    log.error("Role ADMIN not found in the system.");
//                }
//            } else {
//                log.warn("Admin user already exists.");
//            }
//        };
//    }
//}
//
