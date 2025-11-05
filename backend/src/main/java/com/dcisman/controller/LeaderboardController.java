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
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Fetching all leaderboards with limit: {}", limit);
        List<LeaderboardResponse> leaderboards = leaderboardService.getAllLeaderboards(limit);
        return ResponseEntity.ok(leaderboards);
    }

    @GetMapping("/high-score")
    public ResponseEntity<LeaderboardResponse> getHighScoreLeaderboard(
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Fetching high score leaderboard with limit: {}", limit);
        LeaderboardResponse leaderboard = leaderboardService.getHighScoreLeaderboard(limit);
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/highest-level")
    public ResponseEntity<LeaderboardResponse> getHighestLevelLeaderboard(
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Fetching highest level leaderboard with limit: {}", limit);
        LeaderboardResponse leaderboard = leaderboardService.getHighestLevelLeaderboard(limit);
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/total-ghosts")
    public ResponseEntity<LeaderboardResponse> getTotalGhostsLeaderboard(
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Fetching total ghosts leaderboard with limit: {}", limit);
        LeaderboardResponse leaderboard = leaderboardService.getTotalGhostsLeaderboard(limit);
        return ResponseEntity.ok(leaderboard);
    }
}
