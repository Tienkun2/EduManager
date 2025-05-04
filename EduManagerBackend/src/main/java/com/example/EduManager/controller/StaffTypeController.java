package com.example.EduManager.controller;

import com.example.EduManager.dto.request.ApiResponse;
import com.example.EduManager.dto.request.StaffTypeUpdateRequest;
import com.example.EduManager.dto.request.StaffTypeCreationRequest;
import com.example.EduManager.dto.response.StaffTypeResponse;
import com.example.EduManager.service.StaffTypeService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staff-types")
@NoArgsConstructor
@AllArgsConstructor
public class StaffTypeController {
    @Autowired
    private StaffTypeService staffTypeService;

    @PostMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<StaffTypeResponse> creteStaffType(@RequestBody StaffTypeCreationRequest request){
        return ApiResponse.<StaffTypeResponse>builder()
                .code(200)
                .message("create staff type success")
                .result(staffTypeService.createStaffType(request))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteStaffType(@PathVariable String id){
        staffTypeService.deleteStaffType(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("delete staff type success")
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<StaffTypeResponse> updateStaffType(@PathVariable String id, @RequestBody StaffTypeUpdateRequest request){
        return ApiResponse.<StaffTypeResponse>builder()
                .code(200)
                .message("update staff type success")
                .result(staffTypeService.updateStaffType(id, request))
                .build();
    }

    @GetMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<StaffTypeResponse>> getAllStaffType() {
        return ApiResponse.<List<StaffTypeResponse>>builder()
                .code(200)
                .message("get all staff type success")
                .result(staffTypeService.getAllStaffType())
                .build();
    }

}
