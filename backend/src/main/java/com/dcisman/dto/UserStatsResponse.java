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
public class UserStatsResponse {

    private Long id;
    private Long userId;
    private Integer highestScore;
    private Integer totalGhostsEaten;
    private Integer longestTimePlayed; // in seconds
    private Integer totalPowerUpsUsed;
    private Integer highestLevelReached;
    private Integer totalGamesPlayed;
    private Integer totalGamesCompleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
