package com.example.EduManager.Enum;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
public enum LeaveType {
    SICK("Ốm"),
    PERSONAL("Cá nhân"),
    UNPAID("Không lương"),
    ANNUAL("Nghỉ phép năm"),
    MATERNITY("Thai sản"),
    OTHER("Khác");

    private final String value;

    LeaveType(String value) {
        this.value = value;
    }

}