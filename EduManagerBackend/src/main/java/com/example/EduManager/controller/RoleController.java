package com.example.EduManager.controller;

import com.example.EduManager.dto.request.ApiResponse;
import com.example.EduManager.dto.request.RoleRequest;
import com.example.EduManager.dto.response.RoleResponse;
import com.example.EduManager.service.RoleService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
    RoleService roleService;

    @PostMapping()
    public ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest request){
        return ApiResponse.<RoleResponse>builder()
                .message("Create role success!!!")
                .result(roleService.createRole(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<RoleResponse>> getAllRoles(){
        return ApiResponse.<List<RoleResponse>>builder()
                .message("Get all roles success!!!")
                .result(roleService.getAllRole())
                .build();
    }

    @DeleteMapping("/{role}")
    public ApiResponse<Void> deleteResponse(@PathVariable String role){
        roleService.deleteRole(role);
        return ApiResponse.<Void>builder()
                .message("delete role success!!!")
                .build();
    }

}
