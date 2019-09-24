import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {GameComponent} from './game/game.component';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {SettingsComponent} from './settings/settings.component';
import {MaterialModule} from "./material.module";
import {Stopwatch} from "./game/stopwatch";

@NgModule({
  declarations: [
    Stopwatch,
    AppComponent,
    GameComponent,
    LeaderboardComponent,
    SettingsComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
