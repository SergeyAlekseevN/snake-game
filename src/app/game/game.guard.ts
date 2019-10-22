import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {GameService} from "./game.service";

@Injectable({
  providedIn: 'root'
})
export class GameGuard implements CanActivate {
  constructor(private router: Router, private gameService: GameService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let hasGameId: boolean = this.gameService.getGameId() !== null;
    if (!hasGameId) {
      this.router.navigate(['/registration']);
    }
    return hasGameId;
  }
}
