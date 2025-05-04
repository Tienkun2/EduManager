package com.example.EduManager.controller;


import com.example.EduManager.dto.request.ApiResponse;
import com.example.EduManager.dto.request.DepartmentCreationRequest;
import com.example.EduManager.dto.response.DepartmentResponse;
import com.example.EduManager.service.DepartmentService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DepartmentController {
    @Autowired
    DepartmentService departmentService;
    @PostMapping()
    public ApiResponse<DepartmentResponse> createDepartment(@RequestBody DepartmentCreationRequest request){
        return ApiResponse.<DepartmentResponse>builder()
                .message("Create department success!!!")
                .result(departmentService.createDepartment(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<DepartmentResponse> updateDepartment(@PathVariable String id, @RequestBody DepartmentCreationRequest request){
        return ApiResponse.<DepartmentResponse>builder()
                .message("Update department success!!!")
                .result(departmentService.updateDepartment(id, request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<DepartmentResponse> getDepartment(@PathVariable String id){
        return ApiResponse.<DepartmentResponse>builder()
                .message("Get department success!!!")
                .result(departmentService.getDepartmentById(id))
                .build();
    }

    @GetMapping()
    public ApiResponse<List<DepartmentResponse>> getAllDepartment(){
        return ApiResponse.<List<DepartmentResponse>>builder()
                .message("Get all department success!!!")
                .result(departmentService.getAllDepartments())
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteDepartment(@PathVariable String id){
        departmentService.deleteDepartment(id);
        return ApiResponse.<Void>builder()
                .message("delete department success!!!")
                .build();
    }
}
