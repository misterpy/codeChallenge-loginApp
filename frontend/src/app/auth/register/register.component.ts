import { Component, OnDestroy } from '@angular/core';
import { of, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, filter, takeUntil, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class RegisterComponent implements OnDestroy {
  destroyed$: Subject<boolean> = new Subject<boolean>();
  form: FormGroup;
  isLoading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
  ) {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      name: [null, [Validators.required]],
    });
  }

  onRegister(): void {
    if (!this.form.valid) {
      return;
    }

    this.isLoading = true;

    this.authService.register(this.form.value)
      .pipe(
        tap(() => this.isLoading = false),
        catchError(() => {
          this.snackBar.open(
            'Registration failed. Please try again.',
            'ok',
            { duration: 5000 },
          );

          this.isLoading = false;
          return of(null);
        }),
        filter(isSuccessful => !!isSuccessful),
        takeUntil(this.destroyed$),
      )
      .subscribe(() => {
        this.snackBar.open(
          'Registration successful. Please login.',
          'ok',
          { duration: 5000 },
        );
        this.router.navigate(['/auth', 'login']);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
