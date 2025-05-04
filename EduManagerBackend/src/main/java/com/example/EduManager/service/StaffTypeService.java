package com.example.EduManager.service;

import com.example.EduManager.Enum.ErrorCode;
import com.example.EduManager.dto.request.StaffTypeCreationRequest;
import com.example.EduManager.dto.request.StaffTypeUpdateRequest;
import com.example.EduManager.dto.response.StaffTypeResponse;
import com.example.EduManager.entity.StaffType;
import com.example.EduManager.exception.AppException;
import com.example.EduManager.mapper.StaffTypeMapper;
import com.example.EduManager.repository.RoleRepository;
import com.example.EduManager.repository.StaffTypeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class StaffTypeService {
    private final UserService userService;
    private final StaffTypeRepository staffTypeRepository;
    private final StaffTypeMapper staffTypeMapper;
    private final RoleRepository roleRepository;

    public StaffTypeResponse createStaffType(StaffTypeCreationRequest request) {
        // Kiểm tra xem loại nhân sự đã tồn tại chưa
        if (staffTypeRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.STAFF_TYPE_ALREADY_EXISTED);
        }
        // Tạo mới loại nhân sự
        StaffType staffType = staffTypeMapper.toStaffType(request);
        var role = roleRepository.findAllById(request.getRole());
        staffType.setRoles(new HashSet<>(role));
        return staffTypeMapper.toStaffTypeResponse(staffTypeRepository.save(staffType));
    }

    public StaffTypeResponse updateStaffType(String id, StaffTypeUpdateRequest request) {
        // Kiểm tra xem loại nhân sự có tồn tại không
        if (!staffTypeRepository.existsById(id)) {
            throw new AppException(ErrorCode.STAFF_TYPE_NOT_FOUND);
        }
        // Cập nhật loại nhân sự
        StaffType staffType = staffTypeRepository.findById(id).orElseThrow(() -> new RuntimeException("Loại nhân sự không tồn tại"));
        staffTypeMapper.updateStaffType(staffType, request);
        var role = roleRepository.findAllById(request.getRole());
        staffType.setRoles(new HashSet<>(role));
        return staffTypeMapper.toStaffTypeResponse(staffTypeRepository.save(staffType));
    }

    public void deleteStaffType(String id) {
        // Kiểm tra xem loại nhân sự có tồn tại không
        if (!staffTypeRepository.existsById(id)) {
            throw new AppException(ErrorCode.STAFF_TYPE_NOT_FOUND);
        }
        // Xóa loại nhân sự
        staffTypeRepository.deleteById(id);
    }

    public List<StaffTypeResponse> getAllStaffType() {
        // Lấy danh sách loại nhân sự
        return staffTypeRepository.findAll().stream()
                .map(staffTypeMapper::toStaffTypeResponse)
                .toList();
    }
}
