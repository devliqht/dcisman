package com.dcisman.controller;

import com.dcisman.dto.UserStatsResponse;
import com.dcisman.entity.User;
import com.dcisman.service.AuthService;
import com.dcisman.service.UserStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final UserStatsService userStatsService;
    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<UserStatsResponse> getMyStats() {
        User user = getCurrentUser();
        UserStatsResponse stats = userStatsService.getCurrentUserStats(user);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserStatsResponse> getUserStats(
            @PathVariable Long userId) {
        UserStatsResponse stats = userStatsService.getUserStats(userId);
        return ResponseEntity.ok(stats);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return authService.getCurrentUser(username);
    }
}
