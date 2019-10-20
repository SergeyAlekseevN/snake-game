import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Observable} from "rxjs";

export interface Player {
  name: string;
  phone: string;
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
      return ref.orderBy('score','desc');
    });
    this.leaders = this.reference.valueChanges();
  }

  create() {
  }

  update() {
  }

  get(): Observable<Player[]> {
    return this.leaders;
  }
}
