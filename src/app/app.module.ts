import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {GameComponent} from './game/game.component';
import {LeaderboardComponent} from './game/leaderboard/leaderboard.component';
import {SettingsComponent} from './game/settings/settings.component';
import {MaterialModule} from "./modules/material.module";
import {Stopwatch} from "./game/stopwatch";
import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from "../environments/environment";
import {LoginComponent} from './user/login/login.component';
import {RegistrationComponent} from './game/registration/registration.component';
import {LeaderboardService} from "./game/leaderboard/leaderboard.service";
import {ProfileComponent} from './user/profile/profile.component';
import {TimerComponent} from "./game/timer.component";

@NgModule({
  declarations: [
    Stopwatch,
    TimerComponent,
    AppComponent,
    GameComponent,
    LeaderboardComponent,
    SettingsComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    LeaderboardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
