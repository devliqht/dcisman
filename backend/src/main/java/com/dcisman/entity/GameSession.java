package com.dcisman.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "game_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    @Builder.Default
    private Integer score = 0;

    @Column(name = "level_reached", nullable = false)
    @Builder.Default
    private Integer levelReached = 1;

    @Column(name = "duration_seconds", nullable = false)
    @Builder.Default
    private Integer durationSeconds = 0;

    @Column(name = "ghosts_eaten", nullable = false)
    @Builder.Default
    private Integer ghostsEaten = 0;

    @Column(name = "power_ups_used", nullable = false)
    @Builder.Default
    private Integer powerUpsUsed = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.IN_PROGRESS;

    @CreationTimestamp
    @Column(name = "started_at", updatable = false)
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    public enum Status {
        IN_PROGRESS, COMPLETED, ABANDONED
    }
}
