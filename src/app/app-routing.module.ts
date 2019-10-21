import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LeaderboardComponent} from './game/leaderboard/leaderboard.component';
import {GameComponent} from './game/game.component';
import {SettingsComponent} from './game/settings/settings.component';
import {AuthGuard} from "./auth/auth.guard";
import {LoginComponent} from "./user/login/login.component";
import {RegistrationComponent} from "./game/registration/registration.component";

const routes: Routes = [
  {path: '', redirectTo: 'registration', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {
    path: 'registration',
    component: RegistrationComponent,
    data: {allowedRoles: ['admin', 'player']},
    canActivate: [AuthGuard]
  },
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
