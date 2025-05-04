package com.example.EduManager.mapper;

import com.example.EduManager.dto.request.DepartmentCreationRequest;
import com.example.EduManager.dto.response.DepartmentResponse;
import com.example.EduManager.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    @Mapping(target = "parent", ignore = true)  // Bỏ qua, sẽ set ở service
    @Mapping(target = "children", ignore = true)  // Bỏ qua, collection
    @Mapping(target = "users", ignore = true)  // Bỏ qua, collection
    Department toDepartment(DepartmentCreationRequest request);


    @Mapping(target = "parent", ignore = true)  // Bỏ qua, sẽ set ở service
    @Mapping(target = "children", ignore = true)  // Bỏ qua, collection
    @Mapping(target = "users", ignore = true)  // Bỏ qua, collection
    void updateDepartment(@MappingTarget Department department, DepartmentCreationRequest request);

    // MapStruct không tự biết map parent.name => parentName đâu, nên mình phải chỉ nó rõ
    @Mapping(source = "parent.name", target = "parentName")
    @Mapping(target = "children", expression = "java(mapChildren(department))")
    DepartmentResponse toDepartmentResponse(Department department);

    default List<DepartmentResponse> mapChildren(Department department) {
        if (department.getChildren() == null) return Collections.emptyList();
        return department.getChildren().stream()
                .map(this::toDepartmentResponse)  // đệ quy luôn
                .collect(Collectors.toList());    // Java 8 cần .collect()
    }
}
