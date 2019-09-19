import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {GameComponent} from './game/game.component';
import {SettingsComponent} from './settings/settings.component';

const routes: Routes = [
  {path: 'game', component: GameComponent},
  {path: 'leaderboard', component: LeaderboardComponent},
  {path: 'settings', component: SettingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
