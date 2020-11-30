import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-email-password-inputs',
  templateUrl: './email-password-inputs.component.html',
  styleUrls: ['./email-password-inputs.component.scss']
})
export class EmailPasswordInputsComponent {
  @Input() formGroup: FormGroup;

  isClearText = false;
}

