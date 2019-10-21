import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {Player} from "../db/player.model";
import {Game} from "../db/game.model";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  /**
   * Храним в памяти токен активной сессии игры
   * При завершении игры удаляем токен
   */
  constructor(private db: AngularFirestore) {
  }

  /**
   * Идентификатор устройства.
   */
  deviceId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (deviceId === null || deviceId.length <= 0) {
      deviceId = this.db.createId();
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  /**
   * Идентификатор игры.
   * При каждом вызове перезаписывается новый.
   */
  gameId(): string {
    let token = this.db.createId();
    localStorage.setItem('gameId', token);
    return token;
  }

  playerId(name: string, phone: string): string {
    const playerId = "";
    /**
     * TODO playerId
     * 1. поискать по номеру телефона запись
     * 2. если есть - вернуть ID
     * 3. если нет то создать, сохранить и вернуть ID
     */
    const playerRef: AngularFirestoreDocument<Player> = this.db.doc(`players/${playerId}`);

    return "";
  }

  /**
   * 0. Останавливаем все неостановленные ранее сессии.
   * 1. Генерируем токен для новой игры
   * 2. Сохраняем в локальном кеше браузера
   * 3. Создаём сессию в базе-данных
   */
  async startGameSession(phone: string, name: string, startTimestamp: number) {
    console.log('gameSession -> start session');
    let playerId = this.playerId(name, phone);
    let deviceId = this.deviceId();
    let gameId = this.gameId();
    // TODO: 21.10.2019 Sergey Alekseev: проверить что такой записи ещё нет
    const gameRef: AngularFirestoreDocument<Game> = this.db.doc(`games/${gameId}`);
    return gameRef.set({deviceId, gameId, playerId, startTimestamp})
      .catch(reason => console.warn("gameDAO -> can't save game session.", +reason));
  }

  /**
   * 1. Проверяем в локальном кеше наличие игровых сессий
   * 2. Проверяем в базе данных актуальность этих сессий
   * 3. Удаляем из локального кеша неактивные
   */
  hasGameSession(): boolean {
    /**
     * проверяем незакрытые сессии по deviceId
     */
    // TODO: 21.10.2019 Sergey Alekseev:
    return false;
  }

  /**
   * 1. Получаем токен сессии
   * 2. Удаляем из локального кеша
   * 3. Закрываем его в базе данных
   */
  stopGameSession() {
    // TODO: 21.10.2019 Sergey Alekseev:
  }
}
