-- Migration: Add name and id_number columns to users and leaderboard tables
-- Date: 2025-01-17
-- Description: Add ability for users to set their full name and ID number

-- Add columns to users table
ALTER TABLE users
ADD COLUMN name VARCHAR(100) NULL AFTER password_hash,
ADD COLUMN id_number VARCHAR(8) NULL AFTER name;

-- Add columns to leaderboard table
ALTER TABLE leaderboard
ADD COLUMN name VARCHAR(100) NULL AFTER username,
ADD COLUMN id_number VARCHAR(8) NULL AFTER name;
