package com.dcisman.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSessionRequest {
    private Integer score;
    private Integer levelReached;
    private Integer durationSeconds;
    private Integer ghostsEaten;
    private Integer powerUpsUsed;
}
