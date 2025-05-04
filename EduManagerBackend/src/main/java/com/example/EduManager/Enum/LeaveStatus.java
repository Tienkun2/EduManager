package com.example.EduManager.Enum;

import lombok.Getter;

@Getter
public enum LeaveStatus {
    PENDING("Chờ duyệt"),
    APPROVED("Chấp nhận"),
    REJECTED("Từ chối"),
    CANCELLED("Đã hủy");

    private final String value;

    LeaveStatus(String value) {
        this.value = value;
    }

}