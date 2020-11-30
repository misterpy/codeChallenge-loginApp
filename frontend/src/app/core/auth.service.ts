import { Injectable } from '@angular/core';
import { LoginPayload } from '../auth/shared/login.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticatedResponse } from '../auth/shared/authenticated-response.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RegisterPayload } from '../auth/shared/register.model';
import { User } from '../auth/shared/user.model';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedInUser$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(
    private readonly http: HttpClient,
  ) {
    const authToken: string = window.localStorage.getItem('authToken');
    if (!!authToken) {
      this.authenticate()
        .pipe(take(1))
        .subscribe();
    }
  }

  login(payload: LoginPayload): Observable<AuthenticatedResponse> {
    return this.http.post<AuthenticatedResponse>(`${environment.backendUrl}/login`, payload)
      .pipe(tap(res => this.processAuthenticatedResponse(res)));
  }

  register(payload: RegisterPayload): Observable<boolean> {
    return this.http.post<boolean>(`${environment.backendUrl}/register`, payload);
  }

  logout(): void {
    this.loggedInUser$.next(null);
    window.localStorage.setItem('authToken', null);
  }

  authenticate(): Observable<boolean> {
    return this.http.post<AuthenticatedResponse>(`${environment.backendUrl}/authenticate`, null)
      .pipe(
        tap(res => this.processAuthenticatedResponse(res)),
        map(res => !!res),
      );
  }

  private processAuthenticatedResponse({ token, user }: AuthenticatedResponse): void {
    this.loggedInUser$.next(user);
    window.localStorage.setItem('authToken', token);
  }
}
