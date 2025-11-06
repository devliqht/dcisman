package com.dcisman.service;

import com.dcisman.dto.LeaderboardEntry;
import com.dcisman.dto.LeaderboardResponse;
import com.dcisman.entity.UserStats;
import com.dcisman.repository.UserStatsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaderboardService {

    private final UserStatsRepository userStatsRepository;

    @Transactional(readOnly = true)
    public LeaderboardResponse getHighScoreLeaderboard(int page, int pageSize) {
        long totalPlayers = userStatsRepository.count();
        int totalPages = (int) Math.ceil((double) totalPlayers / pageSize);

        Pageable pageable = PageRequest.of(page, pageSize);
        List<UserStats> topStats = userStatsRepository.findTopByHighestScore(pageable);

        List<LeaderboardEntry> entries = topStats.stream()
            .map(stats -> LeaderboardEntry.builder()
                    .userId(stats.getUser().getId())
                    .username(stats.getUser().getUsername())
                    .value(stats.getHighestScore())
                    .rank((page * pageSize) + topStats.indexOf(stats) + 1)
                    .build())
            .collect(Collectors.toList());

        return LeaderboardResponse.builder()
            .category("HIGH_SCORE")
            .entries(entries)
            .lastUpdated(LocalDateTime.now())
            .totalPlayers((int) totalPlayers)
            .currentPage(page)
            .totalPages(totalPages)
            .pageSize(pageSize)
            .build();
    }

    @Transactional(readOnly = true)
    public LeaderboardResponse getHighestLevelLeaderboard(int page, int pageSize) {
        long totalPlayers = userStatsRepository.count();
        int totalPages = (int) Math.ceil((double) totalPlayers / pageSize);

        Pageable pageable = PageRequest.of(page, pageSize);
        List<UserStats> topStats = userStatsRepository.findTopByHighestLevel(pageable);

        List<LeaderboardEntry> entries = topStats.stream()
            .map(stats -> LeaderboardEntry.builder()
                    .userId(stats.getUser().getId())
                    .username(stats.getUser().getUsername())
                    .value(stats.getHighestLevelReached())
                    .rank((page * pageSize) + topStats.indexOf(stats) + 1)
                    .build())
            .collect(Collectors.toList());

        return LeaderboardResponse.builder()
                .category("HIGHEST_LEVEL")
                .entries(entries)
                .lastUpdated(LocalDateTime.now())
                .totalPlayers((int) totalPlayers)
                .currentPage(page)
                .totalPages(totalPages)
                .pageSize(pageSize)
                .build();
    }

    @Transactional(readOnly = true)
    public LeaderboardResponse getTotalGhostsLeaderboard(int page, int pageSize) {
        long totalPlayers = userStatsRepository.count();
        int totalPages = (int) Math.ceil((double) totalPlayers / pageSize);

        Pageable pageable = PageRequest.of(page, pageSize);
        List<UserStats> topStats = userStatsRepository.findTopByTotalGhostsEaten(pageable);

        List<LeaderboardEntry> entries = topStats.stream()
            .map(stats -> LeaderboardEntry.builder()
                    .userId(stats.getUser().getId())
                    .username(stats.getUser().getUsername())
                    .value(stats.getTotalGhostsEaten())
                    .rank((page * pageSize) + topStats.indexOf(stats) + 1)
                    .build())
            .collect(Collectors.toList());

        return LeaderboardResponse.builder()
                .category("TOTAL_GHOSTS")
                .entries(entries)
                .lastUpdated(LocalDateTime.now())
                .totalPlayers((int) totalPlayers)
                .currentPage(page)
                .totalPages(totalPages)
                .pageSize(pageSize)
                .build();
    }

    @Transactional(readOnly = true)
    public List<LeaderboardResponse> getAllLeaderboards(int page, int pageSize) {
        return List.of(
            getHighScoreLeaderboard(page, pageSize),
            getHighestLevelLeaderboard(page, pageSize),
            getTotalGhostsLeaderboard(page, pageSize)
        );
    }
}
