-- Migration: Add dummy users and game session data for testing
-- This script inserts 10 test users with varying stats and game sessions

-- Insert 10 dummy users
-- Password for all users is "password123" (BCrypt hashed)
INSERT INTO users (username, email, password_hash, role, is_active, created_at, updated_at) VALUES
('pacman_pro', 'pacman_pro@test.com', '$2a$10$xwVJZkPOr8K.kQ4TE0fJOeL9qJ5vF5N3p4kKjzF5KPJz6Q7X0aQ3y', 'USER', TRUE, NOW(), NOW()),
('ghost_hunter', 'ghost_hunter@test.com', '$2a$10$xwVJZkPOr8K.kQ4TE0fJOeL9qJ5vF5N3p4kKjzF5KPJz6Q7X0aQ3y', 'USER', TRUE, NOW(), NOW()),
('maze_master', 'maze_master@test.com', '$2a$10$xwVJZkPOr8K.kQ4TE0fJOeL9qJ5vF5N3p4kKjzF5KPJz6Q7X0aQ3y', 'USER', TRUE, NOW(), NOW()),
('pellet_king', 'pellet_king@test.com', '$2a$10$xwVJZkPOr8K.kQ4TE0fJOeL9qJ5vF5N3p4kKjzF5KPJz6Q7X0aQ3y', 'USER', TRUE, NOW(), NOW()),
('speed_runner', 'speed_runner@test.com', '$2a$10$xwVJZkPOr8K.kQ4TE0fJOeL9qJ5vF5N3p4kKjzF5KPJz6Q7X0aQ3y', 'USER', TRUE, NOW(), NOW()),
('cherry_chaser', 'cherry_chaser@test.com', '$2a$10$xwVJZkPOr8K.kQ4TE0fJOeL9qJ5vF5N3p4kKjzF5KPJz6Q7X0aQ3y', 'USER', TRUE, NOW(), NOW()),
('blinky_bane', 'blinky_bane@test.com', '$2a$10$xwVJZkPOr8K.kQ4TE0fJOeL9qJ5vF5N3p4kKjzF5KPJz6Q7X0aQ3y', 'USER', TRUE, NOW(), NOW()),
('inky_slayer', 'inky_slayer@test.com', '$2a$10$xwVJZkPOr8K.kQ4TE0fJOeL9qJ5vF5N3p4kKjzF5KPJz6Q7X0aQ3y', 'USER', TRUE, NOW(), NOW()),
('pinky_player', 'pinky_player@test.com', '$2a$10$xwVJZkPOr8K.kQ4TE0fJOeL9qJ5vF5N3p4kKjzF5KPJz6Q7X0aQ3y', 'USER', TRUE, NOW(), NOW()),
('clyde_crusher', 'clyde_crusher@test.com', '$2a$10$xwVJZkPOr8K.kQ4TE0fJOeL9qJ5vF5N3p4kKjzF5KPJz6Q7X0aQ3y', 'USER', TRUE, NOW(), NOW());

-- Insert user stats for each user
INSERT INTO user_stats (user_id, highest_score, total_ghosts_eaten, longest_time_played, total_power_ups_used, highest_level_reached, total_games_played, total_games_completed, created_at, updated_at) VALUES
-- pacman_pro (best overall)
(1, 50000, 450, 1800, 85, 15, 20, 18, NOW(), NOW()),
-- ghost_hunter (most ghosts)
(2, 42000, 520, 1500, 90, 12, 18, 15, NOW(), NOW()),
-- maze_master
(3, 38000, 380, 1600, 75, 13, 16, 14, NOW(), NOW()),
-- pellet_king
(4, 45000, 410, 1400, 80, 14, 19, 16, NOW(), NOW()),
-- speed_runner (highest level)
(5, 48000, 400, 1200, 78, 18, 17, 15, NOW(), NOW()),
-- cherry_chaser
(6, 35000, 350, 1300, 70, 11, 15, 12, NOW(), NOW()),
-- blinky_bane
(7, 40000, 390, 1550, 82, 13, 16, 14, NOW(), NOW()),
-- inky_slayer
(8, 36000, 360, 1450, 72, 12, 14, 11, NOW(), NOW()),
-- pinky_player
(9, 32000, 330, 1250, 68, 10, 13, 10, NOW(), NOW()),
-- clyde_crusher
(10, 39000, 370, 1350, 76, 12, 15, 13, NOW(), NOW());

-- Insert game sessions for each user (3-4 sessions per user)
-- pacman_pro sessions
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(1, 50000, 15, 1800, 152, 28, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 45000, 14, 1650, 148, 27, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, 42000, 13, 1550, 145, 25, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
(1, 38000, 12, 1450, 140, 24, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));

-- ghost_hunter sessions (most ghosts)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(2, 42000, 12, 1500, 175, 32, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 40000, 11, 1450, 172, 30, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(2, 38000, 11, 1400, 168, 28, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
(2, 35000, 10, 1300, 160, 26, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY));

-- maze_master sessions
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(3, 38000, 13, 1600, 128, 25, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 35000, 12, 1500, 125, 24, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
(3, 32000, 11, 1450, 122, 23, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY));

-- pellet_king sessions
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(4, 45000, 14, 1400, 138, 27, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(4, 43000, 13, 1350, 136, 26, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(4, 40000, 12, 1300, 134, 25, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
(4, 37000, 11, 1250, 130, 24, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 11 DAY));

-- speed_runner sessions (highest level)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(5, 48000, 18, 1200, 135, 26, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 46000, 16, 1150, 133, 25, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(5, 44000, 15, 1100, 131, 24, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY));

-- cherry_chaser sessions
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(6, 35000, 11, 1300, 118, 24, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(6, 33000, 10, 1250, 115, 23, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
(6, 30000, 9, 1200, 112, 22, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));

-- blinky_bane sessions
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(7, 40000, 13, 1550, 131, 28, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(7, 38000, 12, 1500, 128, 27, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(7, 36000, 11, 1450, 125, 26, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
(7, 34000, 10, 1400, 122, 25, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 11 DAY));

-- inky_slayer sessions
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(8, 36000, 12, 1450, 121, 24, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(8, 34000, 11, 1400, 118, 23, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
(8, 32000, 10, 1350, 115, 22, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY));

-- pinky_player sessions
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(9, 32000, 10, 1250, 111, 23, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(9, 30000, 9, 1200, 108, 22, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
(9, 28000, 8, 1150, 105, 21, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));

-- clyde_crusher sessions
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(10, 39000, 12, 1350, 124, 26, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(10, 37000, 11, 1300, 121, 25, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(10, 35000, 10, 1250, 118, 24, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
(10, 33000, 9, 1200, 115, 23, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 11 DAY));
