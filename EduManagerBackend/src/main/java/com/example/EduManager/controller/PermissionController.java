package com.example.EduManager.controller;


import com.example.EduManager.dto.request.ApiResponse;
import com.example.EduManager.dto.request.PermissionRequest;
import com.example.EduManager.dto.request.PermissionUpdateRequest;
import com.example.EduManager.dto.response.PermissionResponse;
import com.example.EduManager.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/permissions")
// Xài requiredArgConstructor khi cần khởi tạo hàm tạo cho các biến final
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @PostMapping()
    ApiResponse<PermissionResponse> createPermission(@RequestBody PermissionRequest request){
        return ApiResponse.<PermissionResponse>builder()
                .message("Create permission success!!!")
                .result(permissionService.createPermission(request))
                .build();
    }


    @GetMapping
    ApiResponse<List<PermissionResponse>> getAllPermission(){
        return ApiResponse.<List<PermissionResponse>>builder()
                .message("Get all permisson success!!!")
                .result(permissionService.getAllPermisson())
                .build();
    }

    @PutMapping("/{permission}")
    ApiResponse<PermissionResponse> updatePermission(@PathVariable String permission, @RequestBody PermissionUpdateRequest request){
        return ApiResponse.<PermissionResponse>builder()
                .message("Update permission success!!!")
                .result(permissionService.updatePermission(permission,request))
                .build();
    }

    @DeleteMapping("/{permission}")
    ApiResponse<Void> deletePermission(@PathVariable String permission){
        permissionService.deletePermission(permission);
        return ApiResponse.<Void>builder()
                .message("delete permission success!!!")
                .build();
    }
}
