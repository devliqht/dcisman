import api from './api';

export interface UserStats {
  id: number;
  userId: number;
  highestScore: number;
  totalGhostsEaten: number;
  longestTimePlayed: number;
  totalPowerUpsUsed: number;
  highestLevelReached: number;
  totalGamesPlayed: number;
  totalGamesCompleted: number;
  createdAt: string;
  updatedAt: string;
}

export const getMyStats = async (): Promise<UserStats> => {
  const response = await api.get('/stats/me');
  return response.data;
};

export const getUserStats = async (userId: number): Promise<UserStats> => {
  const response = await api.get(`/stats/user/${userId}`);
  return response.data;
};

export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};
