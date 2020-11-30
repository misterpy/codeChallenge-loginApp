import { Component } from '@angular/core';
import { User } from '../shared/user.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user$: Observable<User>;

  constructor(
    private readonly authService: AuthService,
  ) {
    this.user$ = this.authService.loggedInUser$;
  }
}
