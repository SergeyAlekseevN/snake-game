import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/firestore";
import {Player} from "../db/player.model";
import {Game} from "../db/game.model";
import {map, switchMap} from "rxjs/operators";
import {EMPTY, Observable} from "rxjs";
import {LeaderboardService} from "./leaderboard/leaderboard.service";

@Injectable({
  providedIn: 'root'
})
export class GameService {


  /**
   * Храним в памяти токен активной сессии игры
   * При завершении игры удаляем токен
   */
  constructor(
    private db: AngularFirestore,
    public leaderboardService: LeaderboardService
  ) {
  }

  async closeOpenedGameSessionsByDeviceId(deviceId: string) {
    const gamesToClose: Observable<Game> = this.db.collection('games', ref => ref
      .where('state', "==", 'online')
      .where('deviceId', '==', deviceId))
      .get()
      .pipe(
        switchMap(value => {
          return value.docs.map(value => value.data() as Game);
        })
      );

    return gamesToClose.pipe(
      map(game => this.db.doc(`games/${game.gameId}`).set({stop: new Date(), state: 'offline'}, {merge: true}))
    ).toPromise();
  }

  /**
   * Идентификатор устройства.
   */
  getDeviceId(): string {
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

  getCurrentPlayer(): Observable<Player> {
    let result: Observable<Player> = EMPTY;
    if (this.getGameId()) {
      console.log('get player');
      const playerRef: AngularFirestoreDocument<Player> = this.db.doc(`players/${localStorage.getItem('playerId')}`);
      result = playerRef.valueChanges();
    }
    return result;
  }

  /**
   * 1. поискать по номеру телефона запись
   * 2. если есть - вернуть ID
   * 3. если нет то создать, сохранить и вернуть ID
   */
  async getPlayerId(name: string, phone: string): Promise<string> {
    console.log("try find player by phone=" + phone);
    let player: Player = null;
    if (phone !== undefined && phone !== null && phone.length > 0) {
      await this.db.collection('players', ref => ref.where('phone', '==', phone).limit(1))
        .get()
        .toPromise()
        .then(value => {
          if (!value.empty) {
            player = value.docs.pop().data() as Player;
          }
        })
        .catch(reason => console.warn("game.service-> find player by phone. Error: " + reason));
    }

    if (player) {
      console.log(`Player with phone ${phone} found. playerId=${player.playerId}`);
      return player.playerId;
    } else {
      console.log(`Player with phone ${phone} does not exist. Create new Player.`)
      const playerId = this.db.createId();
      const newPlayer: Player = {playerId: playerId, name: name, phone: phone, bestScore: null, gameCount: 0};

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
    await this.closeOpenedGameSessionsByDeviceId(this.getDeviceId())
      .then(() => console.log(`Successfully closed opened games.`))
      .catch(reason => console.warn(`Error with closing opened games. ${reason}`));

    console.log('gameSession -> start session');
    let playerId = null;
    await this.getPlayerId(name, phone)
      .then(id => playerId = id)
      .catch(reason => {
        console.warn(`Can't get playerId. reason: ${reason}`);
        throw new Error(`Can't create playerId. ${reason}`);
      });
    localStorage.setItem('playerId', playerId);

    let deviceId = this.getDeviceId();
    let gameId = this.createGameId();
    console.log(`For player ${playerId} on device ${deviceId} created new game session ${gameId}.`);
    // TODO: 21.10.2019 Sergey Alekseev: проверить что такой записи ещё нет
    const gameRef: AngularFirestoreDocument<Game> = this.db.doc(`games/${gameId}`);
    return gameRef.set({deviceId, gameId, playerId, start, state: 'online'});
  }

  setBestScore(playerId: string, bestScore: number) {
    console.log(`set best score for playerId=${playerId}`);
    return this.db.doc(`players/${playerId}`).set({bestScore}, {merge: true});
  }


  /**
   * 1. Получаем токен сессии
   * 2. Удаляем из локального кеша
   * 3. Закрываем его в базе данных
   */
  stopGameSession(score: number) {

    let playerRef: AngularFirestoreDocument<Player> = this.db.doc(`players/${localStorage.getItem('playerId')}`);
    playerRef.get().toPromise().then(doc => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        let player = doc.data() as Player;
        console.log('stopGameSession');
        if (player.bestScore === null || score > player.bestScore) {
          console.log(`Update user ${player.playerId} on leaderboard with result ${score}`);
          this.db.doc(`players/${player.playerId}`).set({bestScore: score,}, {merge: true})
            .then(() => console.log(`update best score for user ${player.playerId} bestScore=${score}`))
            .catch(reason => console.warn(`can't update bestScore for user ${player.playerId}`));

          this.leaderboardService.addResult({uid: player.playerId, name: player.name, score})
        }

        this.db.doc(`players/${player.playerId}`).set({gameCount: player.gameCount + 1}, {merge: true})

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });


    const gameId = this.getGameId();
    this.deleteGameId();
    console.log('remove playerId');
    localStorage.removeItem('playerId');

    console.log('write game results');
    const gameRef: AngularFirestoreDocument<Game> = this.db.doc(`games/${gameId}`);
    return gameRef.set({score: score, stop: new Date(), state: 'offline'}, {merge: true});
  }

  onlineGames(): Observable<Game[]> {
    const gamesReg: AngularFirestoreCollection<Game> = this.db
      .collection('games', ref => ref.where('state', '==', 'online'));
    return gamesReg.valueChanges()
  }
}
