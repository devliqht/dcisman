package com.dcisman.controller;

import com.dcisman.dto.EndSessionRequest;
import com.dcisman.dto.GameSessionResponse;
import com.dcisman.dto.MessageResponse;
import com.dcisman.dto.StartSessionRequest;
import com.dcisman.dto.UpdateSessionRequest;
import com.dcisman.entity.User;
import com.dcisman.service.AuthService;
import com.dcisman.service.GameSessionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game-sessions")
@RequiredArgsConstructor
@Slf4j
public class GameSessionController {

  private final GameSessionService gameSessionService;
  private final AuthService authService;

  @PostMapping("/start")
  public ResponseEntity<?> startSession(
    @RequestBody(required = false) StartSessionRequest request
  ) {
    try {
      Long userId = getCurrentUserId();
      GameSessionResponse response = gameSessionService.startSession(userId);
      log.info("Started game session {} for user {}", response.getId(), userId);
      return ResponseEntity.status(HttpStatus.CREATED).body(response);
    } catch (Exception e) {
      log.error("Failed to start game session: {}", e.getMessage());
      return ResponseEntity.badRequest().body(
        new MessageResponse(e.getMessage())
      );
    }
  }

  @PutMapping("/{sessionId}")
  public ResponseEntity<?> updateSession(
    @PathVariable Long sessionId,
    @RequestBody UpdateSessionRequest request
  ) {
    try {
      Long userId = getCurrentUserId();
      GameSessionResponse response = gameSessionService.updateSession(
        sessionId,
        userId,
        request
      );
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.error("Failed to update game session: {}", e.getMessage());
      return ResponseEntity.badRequest().body(
        new MessageResponse(e.getMessage())
      );
    }
  }

  @PostMapping("/{sessionId}/end")
  public ResponseEntity<?> endSession(
    @PathVariable Long sessionId,
    @RequestBody EndSessionRequest request
  ) {
    try {
      Long userId = getCurrentUserId();
      GameSessionResponse response = gameSessionService.endSession(
        sessionId,
        userId,
        request
      );
      log.info("Ended game session {} for user {}", sessionId, userId);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.error("Failed to end game session: {}", e.getMessage());
      return ResponseEntity.badRequest().body(
        new MessageResponse(e.getMessage())
      );
    }
  }

  @GetMapping
  public ResponseEntity<?> getUserSessions() {
    try {
      Long userId = getCurrentUserId();
      List<GameSessionResponse> sessions = gameSessionService.getUserSessions(
        userId
      );
      return ResponseEntity.ok(sessions);
    } catch (Exception e) {
      log.error("Failed to get user sessions: {}", e.getMessage());
      return ResponseEntity.badRequest().body(
        new MessageResponse(e.getMessage())
      );
    }
  }

  @GetMapping("/{sessionId}")
  public ResponseEntity<?> getSession(@PathVariable Long sessionId) {
    try {
      Long userId = getCurrentUserId();
      GameSessionResponse response = gameSessionService.getSession(
        sessionId,
        userId
      );
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.error("Failed to get game session: {}", e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
        new MessageResponse(e.getMessage())
      );
    }
  }

  @GetMapping("/active")
  public ResponseEntity<?> getActiveSession() {
    try {
      Long userId = getCurrentUserId();
      GameSessionResponse response = gameSessionService.getActiveSession(
        userId
      );
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
        new MessageResponse(e.getMessage())
      );
    }
  }

  private Long getCurrentUserId() {
    Authentication authentication =
      SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();
    User user = authService.getCurrentUser(username);
    return user.getId();
  }
}
