package com.dcisman.repository;

import com.dcisman.entity.UserStats;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, Long> {

    Optional<UserStats> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    @Query("SELECT us FROM UserStats us JOIN FETCH us.user ORDER BY us.highestScore DESC")
    List<UserStats> findTopByHighestScore(Pageable pageable);

    @Query("SELECT us FROM UserStats us JOIN FETCH us.user ORDER BY us.highestLevelReached DESC")
    List<UserStats> findTopByHighestLevel(Pageable pageable);

    @Query("SELECT us FROM UserStats us JOIN FETCH us.user ORDER BY us.totalGhostsEaten DESC")
    List<UserStats> findTopByTotalGhostsEaten(Pageable pageable);
}
