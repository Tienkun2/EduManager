package com.example.EduManager.controller;

import com.example.EduManager.dto.request.ApiResponse;
import com.example.EduManager.dto.request.UserCreationRequest;
import com.example.EduManager.dto.request.UserUpdateRequest;
import com.example.EduManager.dto.response.UserResponse;
import com.example.EduManager.entity.User;
import com.example.EduManager.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@NoArgsConstructor
@AllArgsConstructor
public class UserController {
    private static final Log log = LogFactory.getLog(UserController.class);
    @Autowired
    private UserService userService;

    @PostMapping()
    public ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request){
        return ApiResponse.<UserResponse>builder()
                .code(200)
                .message("Create user success")
                .result(userService.createUser(request))
                .build();
    }


    @GetMapping()
    @PreAuthorize("hasRole('ADMIN')")
    //@PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<List<UserResponse>> getAllUsers(){
        return ApiResponse.<List<UserResponse>>builder()
                .code(200)
                .message("Get all users success")
                .result(userService.getAllUser())
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ApiResponse<User> getUser(@PathVariable String id){
        return ApiResponse.<User>builder()
                .code(200)
                .message("User retrieved successfully")
                .result(userService.getUser(id))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<UserResponse> updateUser(@PathVariable String id, @RequestBody UserUpdateRequest request){
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(id,request))
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id){
        userService.deleteUser(id);
    }


    @GetMapping("/myInfo")
    public ApiResponse<UserResponse> getMyInfo(){
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

//    @PutMapping("/updateMyInfo")
//    public ApiResponse<UserResponse> updateMyInfo(@PathVariable UserUpdateRequest request){
//        return ApiResponse.<UserResponse>builder()
//                .result(userService.updateMyInfo(request))
//                .build();
//    }

}
