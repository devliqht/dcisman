import api from './api';

export interface LeaderboardEntry {
  userId: number;
  username: string;
  value: number;
  rank: number;
}

export interface LeaderboardResponse {
  category: string;
  entries: LeaderboardEntry[];
  lastUpdated: string;
  totalPlayers: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

/**
 * Get all leaderboards at once
 */
export const getAllLeaderboards = async (page: number = 0, pageSize: number = 10): Promise<LeaderboardResponse[]> => {
  const response = await api.get(`/leaderboard?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

/**
 * Get high score leaderboard
 */
export const getHighScoreLeaderboard = async (page: number = 0, pageSize: number = 10): Promise<LeaderboardResponse> => {
  const response = await api.get(`/leaderboard/high-score?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

/**
 * Get highest level leaderboard
 */
export const getHighestLevelLeaderboard = async (page: number = 0, pageSize: number = 10): Promise<LeaderboardResponse> => {
  const response = await api.get(`/leaderboard/highest-level?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

/**
 * Get total ghosts leaderboard
 */
export const getTotalGhostsLeaderboard = async (page: number = 0, pageSize: number = 10): Promise<LeaderboardResponse> => {
  const response = await api.get(`/leaderboard/total-ghosts?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

/**
 * Create a polling function that fetches leaderboards every minute
 */
export const createLeaderboardPoller = (
  callback: (leaderboards: LeaderboardResponse[]) => void,
  page: number = 0,
  pageSize: number = 10,
  intervalMs: number = 60000 // 1 minute
): (() => void) => {
  let intervalId: number | null = null;

  const fetchData = async () => {
    try {
      const data = await getAllLeaderboards(page, pageSize);
      callback(data);
    } catch (error) {
      console.error('Failed to fetch leaderboards:', error);
    }
  };

  fetchData();

  intervalId = window.setInterval(fetchData, intervalMs);

  return () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  };
};
