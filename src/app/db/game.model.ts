export interface Game {
  online?: boolean;
  gameId?: string;
  playerId?: string;
  deviceId?: string;
  start?: Date;
  score?: number;
  stop?: Date;
}
