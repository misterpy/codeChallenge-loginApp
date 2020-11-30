import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    ) {
  }

  canActivate(): Observable<boolean | UrlTree> {
    if (!!this.authService.loggedInUser$.getValue()) {
      return of(true);
    }

    const authToken: string = window.localStorage.getItem('authToken');
    if (!!authToken) {
      return this.authService.authenticate()
        .pipe(
          take(1),
          catchError(() => of(this.router.parseUrl('/auth/login'))),
        );
    }

    return of(this.router.parseUrl('/auth/login'));
  }
}
