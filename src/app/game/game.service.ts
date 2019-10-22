import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";
import {Player} from "../db/player.model";
import {Game} from "../db/game.model";
import {map, switchMap} from "rxjs/operators";
import {Observable} from "rxjs";

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

  async closeOpenedGameSessionsByDeviceId(deviceId: string) {
    const gamesToClose: Observable<Game> = this.db.collection('games', ref => ref
      .where('online', "==", 'true')
      .where('deviceId', '==', deviceId))
      .get()
      .pipe(
        switchMap(value => {
          return value.docs.map(value => value.data() as Game);
        })
      );

    return gamesToClose.pipe(
      map(game => this.db.doc(`games/${game.gameId}`).set({stop: new Date(), online: false}, {merge: true}))
    ).toPromise();
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
  createGameId(): string {
    let token = this.db.createId();
    localStorage.setItem('gameId', token);
    return token;
  }

  getGameId(): string {
    return localStorage.getItem('gameId');
  }

  deleteGameId(): void {
    localStorage.removeItem('gameId');
  }

  /**
   * 1. поискать по номеру телефона запись
   * 2. если есть - вернуть ID
   * 3. если нет то создать, сохранить и вернуть ID
   */
  async playerId(name: string, phone: string): Promise<string> {
    console.log("try find player by phone=" + phone);
    let player: Player = null;
    await this.db.collection('players', ref => ref.where('phone', '==', phone).limit(1))
      .get()
      .toPromise()
      .then(value => {
        if (value.empty) {
          console.log(`Player with phone ${phone} does not exist. Create new Player.`)
        } else {
          player = value.docs.pop().data() as Player;
          console.log(`Player with phone ${phone} found. playerId=${player.playerId}`);
        }
      })
      .catch(reason => console.warn("game.service-> find player by phone. Error: " + reason));

    if (player) {
      return player.playerId;
    } else {
      const playerId = this.db.createId();
      const newPlayer: Player = {playerId: playerId, name: name, phone: phone, bestScore: 0, gameCount: 0};

      console.log(`create player with playerId=${playerId}`);
      await this.db.collection('players').doc(playerId).set(newPlayer)
        .then(() => console.log(`Player ${name} saved.`))
        .catch(reason => console.warn(`Error with saving new player ${name}. Reason: ${reason}.`));
      return playerId;
    }
  }

  /**
   * 0. Останавливаем все неостановленные ранее сессии.
   * 1. Генерируем токен для новой игры
   * 2. Сохраняем в локальном кеше браузера
   * 3. Создаём сессию в базе-данных
   */
  async startGameSession(phone: string, name: string, start: Date) {
    console.log(`before start new game session close opened earlier game sessions.`);
    await this.closeOpenedGameSessionsByDeviceId(this.deviceId())
      .then(() => console.log(`Successfully closed opened games.`))
      .catch(reason => console.warn(`Error with closing opened games. ${reason}`));

    console.log('gameSession -> start session');
    let playerId = null;
    await this.playerId(name, phone)
      .then(id => playerId = id)
      .catch(reason => {
        console.warn(`Can't get playerId. reason: ${reason}`);
        throw new Error(`Can't create playerId. ${reason}`);
      });

    let deviceId = this.deviceId();
    let gameId = this.createGameId();
    console.log(`For player ${playerId} on device ${deviceId} created new game session ${gameId}.`);
    // TODO: 21.10.2019 Sergey Alekseev: проверить что такой записи ещё нет
    const gameRef: AngularFirestoreDocument<Game> = this.db.doc(`games/${gameId}`);
    return gameRef.set({deviceId, gameId, playerId, start, online: true});
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
  stopGameSession(score: number) {
    const gameId = this.getGameId();
    this.deleteGameId();
    const gameRef: AngularFirestoreDocument<Game> = this.db.doc(`games/${gameId}`);
    gameRef.set({score: score, stop: new Date(), online: false}, {merge: true});
  }
}
