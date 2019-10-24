import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Observable} from "rxjs";

export interface TopPlayer {
  uid: string;
  name: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private reference: AngularFirestoreCollection<TopPlayer>;
  leaders: Observable<TopPlayer[]>;

  constructor(private db: AngularFirestore) {
    this.reference = db.collection<TopPlayer>('leaderboard', ref => {
      return ref
        .orderBy('score', 'desc')
        .limit(50);
    });
    this.leaders = this.reference.valueChanges();
  }

  getLeaders(): Observable<TopPlayer[]> {
    return this.leaders;
  }

  addResult(result: TopPlayer) {
    console.log("Add result for leaderboard");
    this.db.doc(`leaderboard/${result.uid}`).set(result, {merge: true})
      .then(() => `successfully write result`)
      .catch(reason => `error ${reason}`);
    return;
  }
}
