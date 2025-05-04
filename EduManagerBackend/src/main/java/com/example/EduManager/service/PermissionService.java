package com.example.EduManager.service;

import com.example.EduManager.Enum.ErrorCode;
import com.example.EduManager.dto.request.PermissionRequest;
import com.example.EduManager.dto.request.PermissionUpdateRequest;
import com.example.EduManager.dto.response.PermissionResponse;
import com.example.EduManager.entity.Permission;
import com.example.EduManager.exception.AppException;
import com.example.EduManager.mapper.PermissionMapper;
import com.example.EduManager.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionService{

    @Autowired
    PermissionRepository permissionRepository;

    @Autowired
    PermissionMapper permissionMapper;

    public PermissionResponse createPermission(PermissionRequest request) {
        Permission permission = permissionMapper.toPermission(request);
        permission = permissionRepository.save(permission);
        PermissionResponse response = permissionMapper.toPermissionResponse(permission);
        return response;
    }

    public PermissionResponse updatePermission(String permission, PermissionUpdateRequest request){
        var existingPermissions = permissionRepository.findById(permission)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_EXISTED));
        permissionMapper.updatePermission(existingPermissions,request);
        permissionRepository.save(existingPermissions);
        return permissionMapper.toPermissionResponse(existingPermissions);
    }


    public List<PermissionResponse> getAllPermisson(){
        var permissons = permissionRepository.findAll();
        // Chuyển permission sang PermissonResponse

        //permissions.stream(): Biến danh sách permissions thành một Stream<Permission>.
        //Khi gọi permissions.stream(),
        // ta đang chuyển đổi List<Permission> thành một Stream – một luồng dữ liệu cho phép thực hiện các thao tác như lọc (filter), ánh xạ (map), sắp xếp (sorted), và thu gọn (collect).
        //.map(permissionMapper::toPermissionResponse): Dùng map() để chuyển từng Permission sang PermissionResponse bằng phương thức toPermissionResponse() của PermissionMapper.
        //.toList(): Chuyển đổi kết quả từ Stream về List<PermissionResponse>.
        return permissons.stream().map(permissionMapper::toPermissionResponse).toList();
    }

    public void deletePermission(String permission){
        permissionRepository.deleteById(permission);
    }

}
