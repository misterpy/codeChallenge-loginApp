import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  isAuthenticated$: Observable<boolean> = this.authService.loggedInUser$
    .pipe(map(user => !!user));

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth', 'login']);
  }
}
