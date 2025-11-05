package com.dcisman.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "highest_score", nullable = false)
    @Builder.Default
    private Integer highestScore = 0;

    @Column(name = "total_ghosts_eaten", nullable = false)
    @Builder.Default
    private Integer totalGhostsEaten = 0;

    @Column(name = "longest_time_played", nullable = false)
    @Builder.Default
    private Integer longestTimePlayed = 0; // in seconds

    @Column(name = "total_power_ups_used", nullable = false)
    @Builder.Default
    private Integer totalPowerUpsUsed = 0;

    @Column(name = "highest_level_reached", nullable = false)
    @Builder.Default
    private Integer highestLevelReached = 0;

    @Column(name = "total_games_played", nullable = false)
    @Builder.Default
    private Integer totalGamesPlayed = 0;

    @Column(name = "total_games_completed", nullable = false)
    @Builder.Default
    private Integer totalGamesCompleted = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
