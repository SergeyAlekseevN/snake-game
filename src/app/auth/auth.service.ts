import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/firestore";


import {Observable, of} from "rxjs";
import {switchMap} from "rxjs/operators";
import {User} from "../db/user.model";
import {auth} from "firebase/app";
import AuthProvider = firebase.auth.AuthProvider;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider)
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }


  private async oAuthLogin(provider: AuthProvider) {
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  private updateUserData({uid, email, displayName, photoURL}) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);
    return userRef.set({uid, email, displayName, photoURL}, {merge: true});
  }


  isHasAccessForRole(userRoles: string[], allowedRoles: string[]): boolean {
    // check if the list of allowed roles is empty, if empty, authorize the user to access the page
    if (allowedRoles === null || allowedRoles.length === 0) {
      return true;
    }

    if(userRoles===null|| userRoles.length===0){
      return false;
    }

    return userRoles.filter(userRole => {return allowedRoles.includes(userRole)}).length > 0
  }

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(credential => this.updateUserData(credential.user))
      .catch(error => console.error(error));
  }

  // Update properties on the user document
  updateUser(user: User, data: any) {
    return this.afs.doc(`users/${user.uid}`).update(data)
  }
}
