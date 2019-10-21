import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Observable} from "rxjs";

export interface Player {
  uid: string;
  name: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private reference: AngularFirestoreCollection<Player>;
  leaders: Observable<Player[]>;

  constructor(private afs: AngularFirestore) {
    this.reference = afs.collection<Player>('leaderboard', ref => {
      return ref
        .orderBy('score', 'desc')
        .limit(50);
    });
    this.leaders = this.reference.valueChanges();
  }

  getLeaders(): Observable<Player[]> {
    return this.leaders;
  }
}
