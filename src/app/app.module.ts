import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {GameComponent} from './game/game.component';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {SettingsComponent} from './settings/settings.component';
import {MaterialModule} from "./material/material.module";
import {Stopwatch} from "./game/stopwatch";
import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from "../environments/environment";
import {LoginComponent} from './login/login.component';
import {PlayerComponent} from './player/player.component';
import {FormsModule} from "@angular/forms";
import {LeaderboardService} from "./leaderboard/leaderboard.service";
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    Stopwatch,
    AppComponent,
    GameComponent,
    LeaderboardComponent,
    SettingsComponent,
    LoginComponent,
    PlayerComponent,
    ProfileComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule,// imports firebase/storage only needed for storage features
    FormsModule,
  ],
  providers: [
    LeaderboardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
