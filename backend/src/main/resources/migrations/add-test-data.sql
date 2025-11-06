-- Migration: Add user stats and game sessions for existing dummy users (IDs 3-12)

-- Insert user stats for dummy users (excluding existing users 1 and 2)
INSERT INTO user_stats (user_id, highest_score, total_ghosts_eaten, longest_time_played, total_power_ups_used, highest_level_reached, total_games_played, total_games_completed, created_at, updated_at) VALUES
-- pacman_pro (best overall)
(3, 50000, 450, 1800, 85, 15, 20, 18, NOW(), NOW()),
-- ghost_hunter (most ghosts)
(4, 42000, 520, 1500, 90, 12, 18, 15, NOW(), NOW()),
-- maze_master
(5, 38000, 380, 1600, 75, 13, 16, 14, NOW(), NOW()),
-- pellet_king
(6, 45000, 410, 1400, 80, 14, 19, 16, NOW(), NOW()),
-- speed_runner (highest level)
(7, 48000, 400, 1200, 78, 18, 17, 15, NOW(), NOW()),
-- cherry_chaser
(8, 35000, 350, 1300, 70, 11, 15, 12, NOW(), NOW()),
-- blinky_bane
(9, 40000, 390, 1550, 82, 13, 16, 14, NOW(), NOW()),
-- inky_slayer
(10, 36000, 360, 1450, 72, 12, 14, 11, NOW(), NOW()),
-- pinky_player
(11, 32000, 330, 1250, 68, 10, 13, 10, NOW(), NOW()),
-- clyde_crusher
(12, 39000, 370, 1350, 76, 12, 15, 13, NOW(), NOW());

-- Insert game sessions for dummy users (3-4 sessions per user)
-- pacman_pro sessions (user_id = 3)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(3, 50000, 15, 1800, 152, 28, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 45000, 14, 1650, 148, 27, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 42000, 13, 1550, 145, 25, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
(3, 38000, 12, 1450, 140, 24, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));

-- ghost_hunter sessions (most ghosts) (user_id = 4)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(4, 42000, 12, 1500, 175, 32, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 40000, 11, 1450, 172, 30, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(4, 38000, 11, 1400, 168, 28, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
(4, 35000, 10, 1300, 160, 26, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY));

-- maze_master sessions (user_id = 5)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(5, 38000, 13, 1600, 128, 25, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 35000, 12, 1500, 125, 24, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
(5, 32000, 11, 1450, 122, 23, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY));

-- pellet_king sessions (user_id = 6)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(6, 45000, 14, 1400, 138, 27, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(6, 43000, 13, 1350, 136, 26, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(6, 40000, 12, 1300, 134, 25, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
(6, 37000, 11, 1250, 130, 24, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 11 DAY));

-- speed_runner sessions (highest level) (user_id = 7)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(7, 48000, 18, 1200, 135, 26, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(7, 46000, 16, 1150, 133, 25, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(7, 44000, 15, 1100, 131, 24, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY));

-- cherry_chaser sessions (user_id = 8)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(8, 35000, 11, 1300, 118, 24, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(8, 33000, 10, 1250, 115, 23, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
(8, 30000, 9, 1200, 112, 22, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));

-- blinky_bane sessions (user_id = 9)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(9, 40000, 13, 1550, 131, 28, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(9, 38000, 12, 1500, 128, 27, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(9, 36000, 11, 1450, 125, 26, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
(9, 34000, 10, 1400, 122, 25, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 11 DAY));

-- inky_slayer sessions (user_id = 10)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(10, 36000, 12, 1450, 121, 24, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(10, 34000, 11, 1400, 118, 23, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
(10, 32000, 10, 1350, 115, 22, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY));

-- pinky_player sessions (user_id = 11)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(11, 32000, 10, 1250, 111, 23, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(11, 30000, 9, 1200, 108, 22, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
(11, 28000, 8, 1150, 105, 21, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));

-- clyde_crusher sessions (user_id = 12)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(12, 39000, 12, 1350, 124, 26, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(12, 37000, 11, 1300, 121, 25, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(12, 35000, 10, 1250, 118, 24, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
(12, 33000, 9, 1200, 115, 23, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 11 DAY));
