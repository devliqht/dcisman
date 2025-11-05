package com.dcisman.service;

import com.dcisman.dto.UserStatsResponse;
import com.dcisman.entity.GameSession;
import com.dcisman.entity.User;
import com.dcisman.entity.UserStats;
import com.dcisman.exception.ResourceNotFoundException;
import com.dcisman.repository.UserStatsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserStatsService {

    private final UserStatsRepository userStatsRepository;

    @Transactional
    public UserStats getOrCreateUserStats(User user) {
        return userStatsRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserStats newStats = UserStats.builder()
                            .user(user)
                            .highestScore(0)
                            .totalGhostsEaten(0)
                            .longestTimePlayed(0)
                            .totalPowerUpsUsed(0)
                            .highestLevelReached(0)
                            .totalGamesPlayed(0)
                            .totalGamesCompleted(0)
                            .build();
                    return userStatsRepository.save(newStats);
                });
    }

    @Transactional
    public void updateStatsFromGameSession(User user, GameSession session) {
        UserStats stats = getOrCreateUserStats(user);

        if (session.getScore() != null && session.getScore() > stats.getHighestScore()) {
            stats.setHighestScore(session.getScore());
        }

        if (session.getGhostsEaten() != null) {
            stats.setTotalGhostsEaten(stats.getTotalGhostsEaten() + session.getGhostsEaten());
        }

        if (session.getDurationSeconds() != null && session.getDurationSeconds() > stats.getLongestTimePlayed()) {
            stats.setLongestTimePlayed(session.getDurationSeconds());
        }

        if (session.getPowerUpsUsed() != null) {
            stats.setTotalPowerUpsUsed(stats.getTotalPowerUpsUsed() + session.getPowerUpsUsed());
        }

        if (session.getLevelReached() != null && session.getLevelReached() > stats.getHighestLevelReached()) {
            stats.setHighestLevelReached(session.getLevelReached());
        }

        stats.setTotalGamesPlayed(stats.getTotalGamesPlayed() + 1);

        if ("COMPLETED".equals(session.getStatus())) {
            stats.setTotalGamesCompleted(stats.getTotalGamesCompleted() + 1);
        }

        userStatsRepository.save(stats);
        log.info("Updated stats for user {}: score={}, level={}",
                user.getUsername(), session.getScore(), session.getLevelReached());
    }

    @Transactional(readOnly = true)
    public UserStatsResponse getUserStats(Long userId) {
        UserStats stats = userStatsRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User stats not found for user ID: " + userId));
        return convertToDto(stats);
    }

    @Transactional
    public UserStatsResponse getCurrentUserStats(User user) {
        UserStats stats = getOrCreateUserStats(user);
        return convertToDto(stats);
    }

    private UserStatsResponse convertToDto(UserStats stats) {
        return UserStatsResponse.builder()
            .id(stats.getId())
            .userId(stats.getUser().getId())
            .highestScore(stats.getHighestScore())
            .totalGhostsEaten(stats.getTotalGhostsEaten())
            .longestTimePlayed(stats.getLongestTimePlayed())
            .totalPowerUpsUsed(stats.getTotalPowerUpsUsed())
            .highestLevelReached(stats.getHighestLevelReached())
            .totalGamesPlayed(stats.getTotalGamesPlayed())
            .totalGamesCompleted(stats.getTotalGamesCompleted())
            .createdAt(stats.getCreatedAt())
            .updatedAt(stats.getUpdatedAt())
            .build();
    }
}
