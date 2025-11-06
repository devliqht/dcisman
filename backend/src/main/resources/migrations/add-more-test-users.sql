-- Migration: Add 10 more dummy users with stats and sessions (IDs 13-22)
-- This brings the total to 20 test users for pagination testing

-- Insert additional dummy users
INSERT INTO users (username, email, password_hash, role, is_active, created_at, updated_at) VALUES
('dot_devourer', 'dot.devourer@pacman.test', '$2a$10$N9qo8uLOickgx2ZErealwe9iVqd.hLg4jMJzkXpBpFJi5K0r6sxgO', 'USER', TRUE, NOW(), NOW()),
('power_pellet_pro', 'power.pellet@pacman.test', '$2a$10$N9qo8uLOickgx2ZErealwe9iVqd.hLg4jMJzkXpBpFJi5K0r6sxgO', 'USER', TRUE, NOW(), NOW()),
('fruit_fanatic', 'fruit.fanatic@pacman.test', '$2a$10$N9qo8uLOickgx2ZErealwe9iVqd.hLg4jMJzkXpBpFJi5K0r6sxgO', 'USER', TRUE, NOW(), NOW()),
('ghost_gobbler', 'ghost.gobbler@pacman.test', '$2a$10$N9qo8uLOickgx2ZErealwe9iVqd.hLg4jMJzkXpBpFJi5K0r6sxgO', 'USER', TRUE, NOW(), NOW()),
('maze_runner', 'maze.runner@pacman.test', '$2a$10$N9qo8uLOickgx2ZErealwe9iVqd.hLg4jMJzkXpBpFJi5K0r6sxgO', 'USER', TRUE, NOW(), NOW()),
('waka_warrior', 'waka.warrior@pacman.test', '$2a$10$N9qo8uLOickgx2ZErealwe9iVqd.hLg4jMJzkXpBpFJi5K0r6sxgO', 'USER', TRUE, NOW(), NOW()),
('arcade_ace', 'arcade.ace@pacman.test', '$2a$10$N9qo8uLOickgx2ZErealwe9iVqd.hLg4jMJzkXpBpFJi5K0r6sxgO', 'USER', TRUE, NOW(), NOW()),
('tunnel_traveler', 'tunnel.traveler@pacman.test', '$2a$10$N9qo8uLOickgx2ZErealwe9iVqd.hLg4jMJzkXpBpFJi5K0r6sxgO', 'USER', TRUE, NOW(), NOW()),
('bonus_hunter', 'bonus.hunter@pacman.test', '$2a$10$N9qo8uLOickgx2ZErealwe9iVqd.hLg4jMJzkXpBpFJi5K0r6sxgO', 'USER', TRUE, NOW(), NOW()),
('retro_gamer', 'retro.gamer@pacman.test', '$2a$10$N9qo8uLOickgx2ZErealwe9iVqd.hLg4jMJzkXpBpFJi5K0r6sxgO', 'USER', TRUE, NOW(), NOW());

-- Insert user stats for new dummy users (IDs 13-22)
INSERT INTO user_stats (user_id, highest_score, total_ghosts_eaten, longest_time_played, total_power_ups_used, highest_level_reached, total_games_played, total_games_completed, created_at, updated_at) VALUES
-- dot_devourer
(13, 41000, 395, 1480, 79, 13, 17, 15, NOW(), NOW()),
-- power_pellet_pro
(14, 46000, 425, 1520, 84, 14, 18, 16, NOW(), NOW()),
-- fruit_fanatic
(15, 34000, 340, 1280, 69, 10, 14, 12, NOW(), NOW()),
-- ghost_gobbler
(16, 43500, 485, 1560, 88, 13, 19, 17, NOW(), NOW()),
-- maze_runner
(17, 37000, 365, 1420, 74, 12, 15, 13, NOW(), NOW()),
-- waka_warrior
(18, 44000, 405, 1500, 81, 13, 18, 15, NOW(), NOW()),
-- arcade_ace
(19, 49000, 440, 1700, 87, 16, 21, 19, NOW(), NOW()),
-- tunnel_traveler
(20, 33000, 325, 1220, 66, 9, 12, 10, NOW(), NOW()),
-- bonus_hunter
(21, 36500, 355, 1380, 71, 11, 14, 12, NOW(), NOW()),
-- retro_gamer
(22, 31000, 310, 1180, 64, 9, 11, 9, NOW(), NOW());

-- Insert game sessions for new dummy users (3-4 sessions per user)

-- dot_devourer sessions (user_id = 13)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(13, 41000, 13, 1480, 133, 27, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(13, 39000, 12, 1430, 130, 26, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(13, 37000, 11, 1380, 127, 25, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
(13, 35000, 10, 1330, 124, 24, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));

-- power_pellet_pro sessions (user_id = 14)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(14, 46000, 14, 1520, 143, 28, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(14, 44000, 13, 1470, 140, 27, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(14, 42000, 12, 1420, 137, 26, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY));

-- fruit_fanatic sessions (user_id = 15)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(15, 34000, 10, 1280, 114, 23, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(15, 32000, 9, 1230, 111, 22, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
(15, 30000, 8, 1180, 108, 21, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY));

-- ghost_gobbler sessions (user_id = 16)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(16, 43500, 13, 1560, 163, 30, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(16, 42000, 12, 1510, 160, 29, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(16, 40000, 11, 1460, 157, 28, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
(16, 38000, 10, 1410, 154, 27, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));

-- maze_runner sessions (user_id = 17)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(17, 37000, 12, 1420, 123, 25, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(17, 35000, 11, 1370, 120, 24, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(17, 33000, 10, 1320, 117, 23, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY));

-- waka_warrior sessions (user_id = 18)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(18, 44000, 13, 1500, 136, 27, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(18, 42000, 12, 1450, 133, 26, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(18, 40000, 11, 1400, 130, 25, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
(18, 38000, 10, 1350, 127, 24, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));

-- arcade_ace sessions (user_id = 19)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(19, 49000, 16, 1700, 148, 29, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(19, 47000, 15, 1650, 145, 28, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(19, 45000, 14, 1600, 142, 27, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
(19, 43000, 13, 1550, 139, 26, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY));

-- tunnel_traveler sessions (user_id = 20)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(20, 33000, 9, 1220, 109, 22, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(20, 31000, 8, 1170, 106, 21, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
(20, 29000, 7, 1120, 103, 20, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY));

-- bonus_hunter sessions (user_id = 21)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(21, 36500, 11, 1380, 119, 24, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(21, 34500, 10, 1330, 116, 23, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(21, 32500, 9, 1280, 113, 22, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY));

-- retro_gamer sessions (user_id = 22)
INSERT INTO game_sessions (user_id, score, level_reached, duration_seconds, ghosts_eaten, power_ups_used, status, started_at, ended_at) VALUES
(22, 31000, 9, 1180, 104, 21, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(22, 29000, 8, 1130, 101, 20, 'COMPLETED', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
(22, 27000, 7, 1080, 98, 19, 'ABANDONED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));
