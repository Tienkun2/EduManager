package com.example.EduManager.Enum;


import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // Common errors
    UNAUTHORIZED_EXCETION(9999, "User không có quyền", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Dữ liệu không hợp lệ", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1002, "User không tồn tại", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1003, "User chưa được xác thực", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1004, "User không có quyền truy cập", HttpStatus.FORBIDDEN),
    USER_EXISTED(1005, "User đã tồn tại", HttpStatus.BAD_REQUEST),

    // Validation errors for User DTO
    INVALID_EMAIL(1010, "Email không hợp lệ hoặc không đúng định dạng", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1011, "Mật khẩu không hợp lệ, phải chứa ít nhất một chữ cái và một số và ít nhất 6 kí tự", HttpStatus.BAD_REQUEST),
    INVALID_ROLE(1012, "Vai trò không hợp lệ, phải là USER, ADMIN hoặc MANAGER", HttpStatus.BAD_REQUEST),
    INVALID_FULL_NAME(1013, "Họ và tên không hợp lệ, chỉ được chứa chữ cái và khoảng trắng", HttpStatus.BAD_REQUEST),
    INVALID_GENDER(1014, "Giới tính không hợp lệ, phải là Nam, Nữ hoặc Khác", HttpStatus.BAD_REQUEST),
    INVALID_DOB(1015, "Ngày sinh không hợp lệ, phải từ 18 tuổi trở lên và không trong tương lai", HttpStatus.BAD_REQUEST),
    INVALID_IDENTITY_CARD(1016, "CMND/CCCD không hợp lệ, phải có 9 hoặc 12 chữ số", HttpStatus.BAD_REQUEST),
    INVALID_PHONE_NUMBER(1017, "Số điện thoại không hợp lệ, ví dụ: 0987654321 hoặc +84987654321", HttpStatus.BAD_REQUEST),
    INVALID_ADDRESS(1018, "Địa chỉ không hợp lệ, tối đa 255 ký tự", HttpStatus.BAD_REQUEST),
    INVALID_STATUS(1019, "Trạng thái không hợp lệ, phải là Đang hoạt động, Đã khóa hoặc Đã nghỉ việc", HttpStatus.BAD_REQUEST),

    // Department errors
    DEPARTMENT_NOT_FOUND(3000, "Phòng ban không tồn tại", HttpStatus.BAD_REQUEST),
    DEPARTMENT_ALREADY_EXISTED(3001, "Phòng ban đã tồn tại", HttpStatus.BAD_REQUEST),
    PARENT_DEPARTMENT_NOT_FOUND(3002, "Phòng ban cha không tồn tại", HttpStatus.BAD_REQUEST),

    // Permission errors
    PERMISSION_NOT_EXISTED(2001, "Quyền không tồn tại", HttpStatus.BAD_REQUEST),
    EMPTY_SCOPE(2002, "Quyền không có scope", HttpStatus.BAD_REQUEST),
    TOEKEN_GENERATE_FAILD(2003, "Tạo token thất bại", HttpStatus.INTERNAL_SERVER_ERROR),

    // Staff type errors
    STAFF_TYPE_ALREADY_EXISTED(4001, "Loại nhân sự đã tồn tại", HttpStatus.BAD_REQUEST),
    STAFF_TYPE_NOT_FOUND(4002, "Loại nhân sự không tồn tại", HttpStatus.BAD_REQUEST),

    // WorkSchedule errors
    SCHEDULE_OVERLAP(5001, "Lịch làm việc bị trùng", HttpStatus.BAD_REQUEST),
    LOCATION_OVERLAP(5002, "Địa điểm bị trùng", HttpStatus.BAD_REQUEST),
    CLASS_OVERLAP(5003, "Lớp học bị trùng", HttpStatus.BAD_REQUEST),
    SCHEDULE_NOT_FOUND(5003, "Lịch làm việc không tồn tại", HttpStatus.BAD_REQUEST),

    // Leave Request errors
    LEAVE_REQUEST_NOT_FOUND(6001, "Yêu cầu nghỉ phép không tồn tại", HttpStatus.BAD_REQUEST),
    INVALID_OPERATION(6002, "Không thể thực hiện thao tác này", HttpStatus.BAD_REQUEST),
    SUBTITLE_USER_NOT_FOUND(6003, "Người thay thế không tồn tại", HttpStatus.BAD_REQUEST);
    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
