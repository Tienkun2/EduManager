package com.example.EduManager.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDate;
import java.time.Period;

public class DobValidator implements ConstraintValidator<DobConstraint, LocalDate> {
    private int minAge;

    @Override
    public void initialize(DobConstraint constraintAnnotation) {
        this.minAge = constraintAnnotation.min();
    }

    @Override
    public boolean isValid(LocalDate dateOfBirth, ConstraintValidatorContext context) {
        if (dateOfBirth == null) {
            return true; // @NotNull hoặc @NotBlank sẽ xử lý trường hợp null
        }

        LocalDate today = LocalDate.now();
        if (dateOfBirth.isAfter(today)) {
            return false; // Ngày sinh không được trong tương lai
        }

        Period period = Period.between(dateOfBirth, today);
        return period.getYears() >= minAge;
    }
}