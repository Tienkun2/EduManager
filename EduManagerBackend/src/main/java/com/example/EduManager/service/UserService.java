package com.example.EduManager.service;

import com.example.EduManager.Enum.ErrorCode;
import com.example.EduManager.dto.request.ChangePassworkRequest;
import com.example.EduManager.dto.request.UserCreationRequest;
import com.example.EduManager.dto.request.UserUpdateRequest;
import com.example.EduManager.dto.response.UserResponse;
import com.example.EduManager.entity.Department;
import com.example.EduManager.entity.StaffType;
import com.example.EduManager.entity.User;
import com.example.EduManager.exception.AppException;
import com.example.EduManager.mapper.UserMapper;
import com.example.EduManager.repository.DepartmentRepository;
import com.example.EduManager.repository.RoleRepository;
import com.example.EduManager.repository.StaffTypeRepository;
import com.example.EduManager.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final RoleRepository roleRepository;
    DepartmentRepository departmentRepository;
    StaffTypeRepository staffTypeRepository;
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    public UserResponse createUser(UserCreationRequest request){
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        var role = roleRepository.findAllById(request.getRole());
        user.setRoles(new HashSet<>(role));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        user.setDepartment(department);

        StaffType staffType = staffTypeRepository.findById(request.getStaffTypeId())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_TYPE_NOT_FOUND));
        user.setStaffType(staffType);

        user.setCreatedDate(LocalDate.now());
        userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    public List<UserResponse> getAllUser(){
        //List<User> users = userRepository.findAll();
        List<User> users = userRepository.findAllByRolesName("USER");
        return userMapper.toUserResponse(users);
    }

    public User getUser(String id){
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserResponse updateUser(String id, UserUpdateRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        userMapper.updateUser(user, request);

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        var roles = roleRepository.findAllById(request.getRole());
        user.setRoles(new HashSet<>(roles));

        // Lưu user vào DB và trả về response
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(String id){
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }



//    public UserResponse updateMyInfo(UserUpdateRequest request){
//        User user = getAuthenticatedUser();
//        user.setFullName(request.getFullName());
//        user.setAge(request.getAge());
//        user.setAddress(request.getAddress());
//        userRepository.save(user);
//        return userMapper.toUserResponse(user);
//    }
    public UserResponse updateMyPassword(ChangePassworkRequest request){
        User user = getAuthenticatedUser();
        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.PASSWORD_MISMATCH);
        }

        // Mã hóa và cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse getMyInfo(){
        User user = getAuthenticatedUser();
        // Check if user status is LOCKED
        if ("LOCKED".equals(user.getStatus()) || "Đã khóa".equals(user.getStatus())) {
            throw new AppException(ErrorCode.USER_LOCKED);
        }
        return userMapper.toUserResponse(user);
    }

    // Hàm lấy user từ token
    private User getAuthenticatedUser() {
        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName(); // Nếu token lưu ID thì lấy ID
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    public void checkUserActivityStatus(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String currentStatus = user.getStatus();
        String newStatus;

        // Cyclic transition logic for String status
        switch (currentStatus) {
            case "ACTIVE":
            case "đang hoạt động":
                newStatus = "LOCKED";
                break;
            case "LOCKED":
            case "đã khóa":
                newStatus = "RETIRED";
                break;
            case "RETIRED":
            case "đã nghỉ":
                newStatus = "ACTIVE";
                break;
            default:
                throw new AppException(ErrorCode.INVALID_USER_STATUS);
        }

        user.setStatus(newStatus);
        userRepository.save(user);
    }


}
