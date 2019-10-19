import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {GameComponent} from './game/game.component';
import {SettingsComponent} from './settings/settings.component';
import {AuthGuard} from "./core/auth.guard";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  {path: '', redirectTo: 'game', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'game', component: GameComponent, data: {allowedRoles: ['admin', 'player']}, canActivate: [AuthGuard]},
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    data: {allowedRoles: ['admin', 'player']},
    canActivate: [AuthGuard]
  },
  {path: 'settings', component: SettingsComponent, data: {allowedRoles: ['admin']}, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
