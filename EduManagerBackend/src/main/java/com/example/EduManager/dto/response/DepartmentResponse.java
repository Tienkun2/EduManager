package com.example.EduManager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse {
    private String id;
    private String name;
    private String description;
    private String parentName;  // có thể giữ lại nếu muốn hiển thị cấp con
    private List<DepartmentResponse> children;  // NHỚ đổi childNames → children
}
