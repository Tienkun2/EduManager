package com.example.EduManager.mapper;

import com.example.EduManager.dto.request.PermissionRequest;
import com.example.EduManager.dto.request.PermissionUpdateRequest;
import com.example.EduManager.dto.response.PermissionResponse;
import com.example.EduManager.entity.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
//giúp MapStruct tạo một bean Spring cho interface này.
// Điều này có nghĩa là bạn có thể inject PermissionMapper vào các service hoặc component khác của Spring.
public interface PermissionMapper {

    // Chuyển đổi từ DTO (PermissionRequest) thành entity (Permission).
    // Ví dụ:
    //PermissionRequest request = new PermissionRequest();
    //request.setName("Admin");
    //Permission permission = permissionMapper.toPermission(request);
    //MapStruct sẽ tự động ánh xạ request.getName() sang permission.setName().
    Permission toPermission(PermissionRequest request);

    //chuyển đổi từ entity (Permission) sang DTO (PermissionResponse).
    //Khi API trả về dữ liệu
    //thường chúng ta cần chuyển entity thành DTO để ẩn bớt thông tin nhạy cảm hoặc chỉ trả về các dữ liệu cần thiết.
    // VD:Permission permission = new Permission();
    //permission.setId(1L);
    //permission.setName("Admin");
    //PermissionResponse response = permissionMapper.toPermissionResponse(permission);
    //MapStruct tự động ánh xạ permission.getId() sang response.setId(), permission.getName() sang response.setName().
    PermissionResponse toPermissionResponse(Permission permission);


    //Cập nhật dữ liệu của entity (Permission) bằng dữ liệu từ DTO (PermissionRequest).
    //Annotation @MappingTarget giúp MapStruct hiểu rằng nó cần chỉnh sửa đối tượng permission thay vì tạo mới.
    void updatePermission(@MappingTarget Permission permission, PermissionUpdateRequest request);
}
