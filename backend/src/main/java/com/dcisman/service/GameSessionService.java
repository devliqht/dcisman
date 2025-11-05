package com.dcisman.service;

import com.dcisman.dto.EndSessionRequest;
import com.dcisman.dto.GameSessionResponse;
import com.dcisman.dto.UpdateSessionRequest;
import com.dcisman.entity.GameSession;
import com.dcisman.entity.User;
import com.dcisman.exception.ResourceNotFoundException;
import com.dcisman.repository.GameSessionRepository;
import com.dcisman.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GameSessionService {

  private final GameSessionRepository gameSessionRepository;
  private final UserRepository userRepository;
  private final UserStatsService userStatsService;

  @Transactional
  public GameSessionResponse startSession(Long userId) {
    User user = userRepository
      .findById(userId)
      .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    gameSessionRepository
      .findFirstByUserIdAndStatusOrderByStartedAtDesc(
        userId,
        GameSession.Status.IN_PROGRESS
      )
      .ifPresent(existingSession -> {
        existingSession.setStatus(GameSession.Status.ABANDONED);
        existingSession.setEndedAt(LocalDateTime.now());
        gameSessionRepository.save(existingSession);
      });

    GameSession session = GameSession.builder()
      .user(user)
      .score(0)
      .levelReached(1)
      .durationSeconds(0)
      .ghostsEaten(0)
      .powerUpsUsed(0)
      .status(GameSession.Status.IN_PROGRESS)
      .build();

    GameSession savedSession = gameSessionRepository.save(session);
    return toResponse(savedSession);
  }

  @Transactional
  public GameSessionResponse updateSession(
    Long sessionId,
    Long userId,
    UpdateSessionRequest request
  ) {
    GameSession session = gameSessionRepository
      .findByIdAndUserId(sessionId, userId)
      .orElseThrow(() ->
        new ResourceNotFoundException("Game session not found")
      );

    if (session.getStatus() != GameSession.Status.IN_PROGRESS) {
      throw new IllegalStateException(
        "Cannot update a session that is not in progress"
      );
    }

    if (request.getScore() != null) {
      session.setScore(request.getScore());
    }
    if (request.getLevelReached() != null) {
      session.setLevelReached(request.getLevelReached());
    }
    if (request.getDurationSeconds() != null) {
      session.setDurationSeconds(request.getDurationSeconds());
    }
    if (request.getGhostsEaten() != null) {
      session.setGhostsEaten(request.getGhostsEaten());
    }
    if (request.getPowerUpsUsed() != null) {
      session.setPowerUpsUsed(request.getPowerUpsUsed());
    }

    GameSession updatedSession = gameSessionRepository.save(session);
    return toResponse(updatedSession);
  }

  @Transactional
  public GameSessionResponse endSession(
    Long sessionId,
    Long userId,
    EndSessionRequest request
  ) {
    GameSession session = gameSessionRepository
      .findByIdAndUserId(sessionId, userId)
      .orElseThrow(() ->
        new ResourceNotFoundException("Game session not found")
      );

    if (session.getStatus() != GameSession.Status.IN_PROGRESS) {
      throw new IllegalStateException("Session is already ended");
    }

    if (request.getScore() != null) {
      session.setScore(request.getScore());
    }
    if (request.getLevelReached() != null) {
      session.setLevelReached(request.getLevelReached());
    }
    if (request.getDurationSeconds() != null) {
      session.setDurationSeconds(request.getDurationSeconds());
    }
    if (request.getGhostsEaten() != null) {
      session.setGhostsEaten(request.getGhostsEaten());
    }
    if (request.getPowerUpsUsed() != null) {
      session.setPowerUpsUsed(request.getPowerUpsUsed());
    }

    String statusStr = request.getStatus();
    if ("COMPLETED".equalsIgnoreCase(statusStr)) {
      session.setStatus(GameSession.Status.COMPLETED);
    } else {
      session.setStatus(GameSession.Status.ABANDONED);
    }

    session.setEndedAt(LocalDateTime.now());
    GameSession endedSession = gameSessionRepository.save(session);
    userStatsService.updateStatsFromGameSession(session.getUser(), endedSession);
    return toResponse(endedSession);
  }

  @Transactional(readOnly = true)
  public List<GameSessionResponse> getUserSessions(Long userId) {
    return gameSessionRepository
      .findByUserIdOrderByStartedAtDesc(userId)
      .stream()
      .map(this::toResponse)
      .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public GameSessionResponse getSession(Long sessionId, Long userId) {
    GameSession session = gameSessionRepository
      .findByIdAndUserId(sessionId, userId)
      .orElseThrow(() ->
        new ResourceNotFoundException("Game session not found")
      );
    return toResponse(session);
  }

  @Transactional(readOnly = true)
  public GameSessionResponse getActiveSession(Long userId) {
    GameSession session = gameSessionRepository
      .findFirstByUserIdAndStatusOrderByStartedAtDesc(
        userId,
        GameSession.Status.IN_PROGRESS
      )
      .orElseThrow(() ->
        new ResourceNotFoundException("No active game session found")
      );
    return toResponse(session);
  }

  private GameSessionResponse toResponse(GameSession session) {
    return GameSessionResponse.builder()
      .id(session.getId())
      .userId(session.getUser().getId())
      .username(session.getUser().getUsername())
      .score(session.getScore())
      .levelReached(session.getLevelReached())
      .durationSeconds(session.getDurationSeconds())
      .ghostsEaten(session.getGhostsEaten())
      .powerUpsUsed(session.getPowerUpsUsed())
      .status(session.getStatus().name())
      .startedAt(session.getStartedAt())
      .endedAt(session.getEndedAt())
      .build();
  }
}
