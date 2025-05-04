package com.example.EduManager.service;

import com.example.EduManager.Enum.ErrorCode;
import com.example.EduManager.dto.request.DepartmentCreationRequest;
import com.example.EduManager.dto.response.DepartmentResponse;
import com.example.EduManager.entity.Department;
import com.example.EduManager.exception.AppException;
import com.example.EduManager.mapper.DepartmentMapper;
import com.example.EduManager.repository.DepartmentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class DepartmentService {
    DepartmentRepository departmentRepository;
    DepartmentMapper departmentMapper;

    public DepartmentResponse createDepartment(DepartmentCreationRequest request) {
        // Kiểm tra xem department với tên này đã tồn tại chưa
        if (departmentRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.DEPARTMENT_ALREADY_EXISTED);
        }

        Department department = departmentMapper.toDepartment(request);

        // Xử lý parent nếu có
        if (request.getParentName() != null && !request.getParentName().isEmpty()) {
            Department parent = departmentRepository.findByName(request.getParentName())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_DEPARTMENT_NOT_FOUND));
            department.setParent(parent);
        }

        departmentRepository.save(department);
        return departmentMapper.toDepartmentResponse(department);
    }

    public DepartmentResponse updateDepartment(String id, DepartmentCreationRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        departmentMapper.updateDepartment(department, request);

        departmentRepository.save(department);
        return departmentMapper.toDepartmentResponse(department);
    }

    public List<DepartmentResponse> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();

        return departments.stream()
                .filter(dept -> dept.getParent() == null)
                .map(departmentMapper::toDepartmentResponse)
                .toList();
    }


    public DepartmentResponse getDepartmentById(String id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
        return departmentMapper.toDepartmentResponse(department);
    }

    public void deleteDepartment(String id){
        departmentRepository.deleteById(id);
    }
}