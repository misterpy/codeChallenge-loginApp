import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { of, Subject } from 'rxjs';
import { catchError, filter, takeUntil, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  isLoading = false;
  form: FormGroup;
  destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });

    this.authService.loggedInUser$
      .pipe(
        filter(user => !!user),
        takeUntil(this.destroyed$),
      )
      .subscribe(() => this.router.navigate(['/auth', 'profile']));
  }

  onLogin(): void {
    if (!this.form.valid) {
      return;
    }

    this.isLoading = true;

    this.authService.login(this.form.value)
      .pipe(
        tap(() => this.isLoading = false),
        catchError(() => {
          this.snackBar.open(
            'Authentication failed. Please try again.',
            'ok',
            { duration: 5000 },
          );

          this.isLoading = false;
          return of(null);
        }),
        filter(isAuthenticated => !!isAuthenticated),
        takeUntil(this.destroyed$),
      )
      .subscribe(res => {
        this.router.navigate(['/auth', 'profile']);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
