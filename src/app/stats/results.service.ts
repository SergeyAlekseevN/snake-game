import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {TopPlayer} from "../game/leaderboard/leaderboard.service";
import {Player} from "../db/player.model";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {Game} from "../db/game.model";

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private readonly topPlayerPath = 'leaderboard';
  private topPlayers: AngularFirestoreCollection<TopPlayer>;

  private readonly playersPath = 'players';
  private players: AngularFirestoreCollection<Player>;

  private readonly gamesPath = 'games';
  private games: AngularFirestoreCollection<Game>;

  constructor(private db: AngularFirestore) {
    this.topPlayers = db.collection(this.topPlayerPath);
    this.players = db.collection(this.playersPath);
    this.games = db.collection(this.gamesPath);
  }

  /**
   * 1. Общее количество игроков
   */
  public getTotalPlayers(): Observable<number> {
    console.log("get total players count");
    return this.players.get().pipe(map(querySnapshot => querySnapshot.size));
  }

  /**
   * 2. Общеее количество игр
   */
  public getTotalGames(): Observable<number> {
    console.log('get total games count');
    return this.games.get().pipe(map(querySnapshot => querySnapshot.size));
  }

  /**
   * 3. Максимальное количество очков
   */
  public getBestScore(): Observable<number> {
    console.log('get best score');
    return this.db.collection<TopPlayer>(this.topPlayerPath, ref => {
      return ref
        .orderBy('score', 'desc')
        .limit(1);
    })
      .get()
      .pipe(
        map(snapshot => snapshot.docs[0].get('score')),
      );
  }

  /**
   * 4. Минимальное количество очков
   */
  public getWorstScore(): Observable<number> {
    console.log('get worst score');
    return this.db.collection<TopPlayer>(this.topPlayerPath, ref => {
      return ref
        .orderBy('score', 'asc')
        .limit(1);
    })
      .get()
      .pipe(
        map(snapshot => snapshot.docs[0].get('score')
        ));
  }

  /**
   * 6. Игрок с Максимальным количеством игр
   */
  public getPlayerWithMaxGameCount(): Observable<Player> {
    console.log('get player with max game count');
    return this.db.collection<Player>(this.playersPath, ref => {
      return ref
        .orderBy('gameCount', 'desc')
        .limit(1);
    })
      .get()
      .pipe(
        map(snapshot => snapshot.docs[0].data() as Player)
      );
  }

  /**
   * 5. Экспорт Телефон/Имя/Результат CSV
   */
  getAllPlayers(): Observable<Player[]> {
    return this.db.collection<Player>(this.playersPath, ref => {
      return ref
        .orderBy('bestScore', 'desc')
    })
      .get()
      .pipe(
        map(snapshot => snapshot.docs.map(doc => doc.data() as Player))
      );
  }
}
