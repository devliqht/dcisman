package com.dcisman.controller;

import com.dcisman.dto.LeaderboardResponse;
import com.dcisman.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
@Slf4j
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<List<LeaderboardResponse>> getAllLeaderboards(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        log.info("Fetching all leaderboards - page: {}, pageSize: {}", page, pageSize);
        List<LeaderboardResponse> leaderboards = leaderboardService.getAllLeaderboards(page, pageSize);
        return ResponseEntity.ok(leaderboards);
    }

    @GetMapping("/high-score")
    public ResponseEntity<LeaderboardResponse> getHighScoreLeaderboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        log.info("Fetching high score leaderboard - page: {}, pageSize: {}", page, pageSize);
        LeaderboardResponse leaderboard = leaderboardService.getHighScoreLeaderboard(page, pageSize);
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/highest-level")
    public ResponseEntity<LeaderboardResponse> getHighestLevelLeaderboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        log.info("Fetching highest level leaderboard - page: {}, pageSize: {}", page, pageSize);
        LeaderboardResponse leaderboard = leaderboardService.getHighestLevelLeaderboard(page, pageSize);
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/total-ghosts")
    public ResponseEntity<LeaderboardResponse> getTotalGhostsLeaderboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        log.info("Fetching total ghosts leaderboard - page: {}, pageSize: {}", page, pageSize);
        LeaderboardResponse leaderboard = leaderboardService.getTotalGhostsLeaderboard(page, pageSize);
        return ResponseEntity.ok(leaderboard);
    }
}
