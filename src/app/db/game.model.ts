export interface Game {
  gameId: string;
  playerId: string;
  deviceId: string;
  startTimestamp: number;
  endTimestamp?: number;
}
