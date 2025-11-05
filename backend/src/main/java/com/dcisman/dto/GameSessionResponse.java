package com.dcisman.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameSessionResponse {
    private Long id;
    private Long userId;
    private String username;
    private Integer score;
    private Integer levelReached;
    private Integer durationSeconds;
    private Integer ghostsEaten;
    private Integer powerUpsUsed;
    private String status;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
}
