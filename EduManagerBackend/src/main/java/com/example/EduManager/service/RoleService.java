package com.example.EduManager.service;

import com.example.EduManager.dto.request.RoleRequest;
import com.example.EduManager.dto.response.RoleResponse;
import com.example.EduManager.entity.Role;
import com.example.EduManager.mapper.RoleMapper;
import com.example.EduManager.repository.PermissionRepository;
import com.example.EduManager.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;

    PermissionRepository permissionRepository;

    RoleMapper roleMapper;

    public RoleResponse createRole(RoleRequest request){
        // Lúc này đã map nhưng bỏ thằng permissions
        Role role = roleMapper.toRole(request);
        // Ở đây vì là 1 set nên phải findAll
        var permissions = permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));
        role = roleRepository.save(role);
        return roleMapper.toRoleResponse(role);
    }

    public List<RoleResponse> getAllRole(){
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }

    public void deleteRole(String role){
        roleRepository.deleteById(role);
    }
}
