package com.dcisman.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @Pattern(regexp = "^[0-9]{0,8}$", message = "ID number must be numeric and max 8 digits")
    @Size(max = 8, message = "ID number cannot exceed 8 digits")
    private String idNumber;
}
