package com.dcisman.repository;

import com.dcisman.entity.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, Long> {

    List<GameSession> findByUserIdOrderByStartedAtDesc(Long userId);

    Optional<GameSession> findByIdAndUserId(Long id, Long userId);

    List<GameSession> findByUserIdAndStatus(Long userId, GameSession.Status status);

    Optional<GameSession> findFirstByUserIdAndStatusOrderByStartedAtDesc(Long userId, GameSession.Status status);
}
