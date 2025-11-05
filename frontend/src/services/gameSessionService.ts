import api from './api';

export interface GameSessionData {
  id: number;
  userId: number;
  username: string;
  score: number;
  levelReached: number;
  durationSeconds: number;
  ghostsEaten: number;
  powerUpsUsed: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  startedAt: string;
  endedAt: string | null;
}

export interface UpdateSessionData {
  score?: number;
  levelReached?: number;
  durationSeconds?: number;
  ghostsEaten?: number;
  powerUpsUsed?: number;
}

export interface EndSessionData {
  score: number;
  levelReached: number;
  durationSeconds: number;
  ghostsEaten: number;
  powerUpsUsed: number;
  status: 'COMPLETED' | 'ABANDONED';
}


export const startGameSession = async (): Promise<GameSessionData> => {
  const response = await api.post('/game-sessions/start', {});
  return response.data;
};


export const updateGameSession = async (
  sessionId: number,
  data: UpdateSessionData
): Promise<GameSessionData> => {
  const response = await api.put(`/game-sessions/${sessionId}`, data);
  return response.data;
};


export const endGameSession = async (
  sessionId: number,
  data: EndSessionData
): Promise<GameSessionData> => {
  const response = await api.post(`/game-sessions/${sessionId}/end`, data);
  return response.data;
};


export const getUserSessions = async (): Promise<GameSessionData[]> => {
  const response = await api.get('/game-sessions');
  return response.data;
};


export const getGameSession = async (
  sessionId: number
): Promise<GameSessionData> => {
  const response = await api.get(`/game-sessions/${sessionId}`);
  return response.data;
};


export const getActiveSession = async (): Promise<GameSessionData> => {
  const response = await api.get('/game-sessions/active');
  return response.data;
};
