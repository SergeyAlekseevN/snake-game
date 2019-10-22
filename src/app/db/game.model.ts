export interface Game {
  state?: string;
  gameId?: string;
  playerId?: string;
  deviceId?: string;
  start?: Date;// TODO: 22.10.2019 Sergey Alekseev: firebase возвращает Timestamp
  score?: number;
  stop?: Date;// TODO: 22.10.2019 Sergey Alekseev: firebase возвращает Timestamp
}
